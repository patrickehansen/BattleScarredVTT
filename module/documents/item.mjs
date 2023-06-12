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

  getRollContext() { 
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const defaultLabel = `[${item.type}] ${item.name}`;

    return {
      item,
      speaker,
      rollMode,
      defaultLabel,
    }
  }
  
  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const {
      item,
      speaker,
      rollMode,
      defaultLabel,
    } = this.getRollContext();
    
    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: defaultLabel,
        content: item.system.description ?? ''
      });
    } else {
      // Retrieve roll data.
      const rollData = this.getRollData();
      const roll = new Roll(rollData.item.formula, rollData);

      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label ?? defaultLabel,
      });

      return rolls;
    }
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
}
