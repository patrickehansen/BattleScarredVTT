/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class BattleScarredItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const defaultLabel = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: defaultLabel,
        content: item.system.description ?? ''
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();
      const rolls = this[`_roll${pascalCase(this.type)}`]?.(rollData, defaultLabel) ?? [{ roll : new Roll(rollData.item.formula, rollData) }];

      // If you need to store the value first, uncomment the next line.
      // let result = await roll.roll({async: true});
      rolls.forEach(({roll, label}) => {
        roll.toMessage({
          speaker: speaker,
          rollMode: rollMode,
          flavor: label ?? defaultLabel,
        });
      })
      
      return rolls;
    }
  }

  _rollWeapon(rollData, defaultLabel) {
    return [
      {
        roll: new Roll('3d6 - @hitStat', rollData),
        label: `${defaultLabel} attack`,
      },
      {
        roll: new Roll('@dice + @bonus', rollData),
        label: `${defaultLabel} damage`,
      }
    ]
  }

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
  getRollData() {
    // If present, return the actor's roll data.
    if ( !this.actor ) return null;
    const rollData = this.actor.getRollData();
    
    Object.assign(rollData, rollData.abilities);
    rollData.item = foundry.utils.deepClone(this.system);

    this[`_get${pascalCase(this.type)}RollData`]?.(rollData);
    
    return rollData;
  }
  
  _getWeaponRollData(rollData) {
    const { dice, bonus } = rollData?.item?.system.damage;
    const equippedMode = rollData?.item?.system.equippedMode;

    // We probably need to optional chain this up
    const damageStat = rollData.abilities[rollData.item.system.dmgStat].mod;

    // TODO:: refactor this architecture
    const multiplier = equippedMode === 'twoHand' ? 2 : 1;

    return {
      // Value of stat used for hitting success evaluation
      hitStat: rollData.abilities[rollData.item.system.damage.hitStat].mod,

      // Damage assessment
      dice: dice,
      bonus: bonus + (damageStat * multiplier),
    }
  }
}
