import { capitalCase } from 'change-case';
import { BattleScarredItemSheet } from '../item-sheet.mjs';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class BattleScarredWeaponSheet extends BattleScarredItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["BattleScarredVTT", "sheet", "item"],
      width: 520,
      height: 520,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/BattleScarredVTT/templates/item";

    return `${path}/item-weapon-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve base data structure.
    const context = await super.getData();

    // Use a safe clone of the item data for further operations.
    context.system.hitStat = game.i18n.localize(CONFIG.BATTLESCARREDVTT.abilities.names[context.system.hitStat]);
    context.system.weaponType = capitalCase(context.system.weaponType);
    context.system.equipModes = context.system.equipModes.map(v => ({
      label: capitalCase(v),
      equipped: false,
    }));

    return context;
  }

  /* -------------------------------------------- */
  /** @override */
  activateListeners(html) {
    // Is this even needed?
    super.activateListeners(html);
  }

  _onRoll(event) {
    event.preventDefault();

    const item = this?.item;

    // Handle item rolls.
    if (item) return item.roll();
  }
}
