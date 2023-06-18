import { BattleScarredItem } from "../item.mjs";

export class BattleScarredWeapon extends BattleScarredItem {

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const rollContext = super.getRollContext();
    const {defaultLabel} = rollContext;

    // Retrieve roll data.
    const rollData = this.getRollData();
    const rolls = [
      {
        roll: new Roll('3d6 - @hitStat', rollData),
        label: `${defaultLabel} attack`,
      },
      {
        roll: new Roll('@dice + @bonus', rollData),
        label: `${defaultLabel} damage`,
      }
    ];

    // If you need to store the value first, uncomment the next line.
    // let result = await roll.roll({async: true});
    rolls.forEach(({roll, label}) => {
      roll.toMessage({
        speaker: rollContext.speaker,
        rollMode: rollContext.rollMode,
        flavor: label ?? defaultLabel,
      });
    })
    
    return rolls;
  }

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
  getRollData() {
    const rollData = super.getRollData();

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
