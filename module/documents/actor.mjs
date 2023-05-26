/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class BattleScarredActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const data = actorData.system;
    const flags = actorData.flags.battleScarredVTT || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const data = actorData.system;

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(data.abilities)) {
      ability.mod = Math.ceil(ability.value);
    }

    // Calculate max health and aether.
    data.health.max = data.abilities[data.health.complement].mod * data.health.multiplier;
    data.aether.max = data.abilities[data.aether.complement].mod * data.aether.multiplier;
    // For now, we have a hard cap at 30. Maybe there will be affects later.
    data.action.max = 30;

    this._prepareArmorData(actorData);
    this._prepareEncumbranceData(actorData);
    this._prepareSpellData(actorData);
  }

  _prepareArmorData(actorData) {
    // Iterate over armor items and figure out mitigation and health
    actorData.system.armorMitigation = 0;
    actorData.system.armorHealth = {
      value : 100,
      max : 100,
    }
  }

  // STR*5+END*5 = Equip Weight
  _prepareEncumbranceData(actorData) {
    const { str, end } = actorData.system.abilities;
    actorData.system.carry = str.mod * 5 + end.mod * 5;

    // sum up all carried item weight and divide it by carry
    actorData.system.carriedWeight = 0;
    actorData.system.encumbrance = this._encumbrance(actorData.system.carriedWeight, actorData.system.carry);
    actorData.system.lift = this._lift(str.mod);
  }

  _prepareSpellData(actorData) {
    actorData.system.codexSlots.value = 0;
  }
  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.system.type !== 'character') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.system.type !== 'npc') return;

    // Process additional NPC data here.
  }

  // Light 0-25%
  // Med 26-60%
  // Hev 61-80%
  // Enc 81-100%
  // Fuc 101%+
  _encumbrance(carried, maxCarry) {
    const percentage = (carried / maxCarry) * 100;

    if (percentage === 0) return 'None';
    if (percentage <= 26) return 'Light';
    if (percentage <= 61) return 'Medium';
    if (percentage <= 81) return 'Heavy';
    if (percentage <= 100) return 'Encumbered';
    return 'Fuuuuucked';
  }

  _lift(str) {  
    const strength = typeof str === 'number' ? str : Number(str);
    const basic = strength * 8.1 * Math.pow(1.1, strength);

    // Ceiling to nearest 20
    return roundToNearestXWithOffset(basic, 20, 0);
  }
}

function roundToNearestXWithOffset(number, increment, offset = 0) {
  return Math.ceil((number - offset) / increment ) * increment + offset;
}
