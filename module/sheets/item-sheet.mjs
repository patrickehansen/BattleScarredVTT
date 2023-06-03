import {capitalize} from '../helpers/utils.mjs';
import { capitalCase, pascalCase } from 'change-case';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class BattleScarredItemSheet extends ItemSheet {

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
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.
    return `${path}/item-${this.item.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = structuredClone(this.item);

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add the actor's data to context.system for easier access, as well as flags.
    context.system = structuredClone(itemData.system);
    context.flags = itemData.flags;

    context.description = await TextEditor.enrichHTML(itemData.system.description, { async: true });

    this[`_get${pascalCase(itemData.type)}Data`]?.(context);

    return context;
  }

  async _getWeaponData(context) {  
    context.system.hitStat = game.i18n.localize(CONFIG.BATTLESCARREDVTT.abilities.names[context.system.hitStat]);
    context.system.weaponType = capitalCase(context.system.weaponType);
    context.system.equipModes = context.system.equipModes.map(v => ({
      label: capitalCase(v),
      equipped: false,
    }));
  }

  /* -------------------------------------------- */
  /** @override */
  activateListeners(html) {
    //super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.
  }
}
