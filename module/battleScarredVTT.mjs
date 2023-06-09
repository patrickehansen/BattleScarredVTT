// Import document classes.
import { BattleScarredActor } from "./documents/actor.mjs";
import { BattleScarredItem } from "./documents/item.mjs";
import { BattleScarredWeapon } from "./documents/items/weapon.mjs";
// Import sheet classes.
import { BattleScarredActorSheet } from "./sheets/actor-sheet.mjs";
import { BattleScarredItemSheet } from "./sheets/item-sheet.mjs";
import { BattleScarredWeaponSheet } from "./sheets/items/weapon-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { BATTLESCARREDVTT } from "./helpers/config.mjs";
import { helpers } from "./handlebars.mjs";

import { CharacterData } from "./dataModels/character.mjs";
import { BattleScarredItemProxy } from "./documents/itemProxy.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */
Hooks.once('init', async function() {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.BattleScarredVTT = {
    BattleScarredActor,
    BattleScarredWeapon,
    BattleScarredItem,
    rollItemMacro,
  };

  // Add custom constants for configuration.
  CONFIG.BATTLESCARREDVTT = BATTLESCARREDVTT;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20 + @abilities.dex.mod",
    decimals: 2
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = BattleScarredActor;
  CONFIG.Item.documentClass = BattleScarredItemProxy;
  CONFIG.Actor.systemDataModels.characterAgain = CharacterData;

  // Register sheet application classes
  // Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("BattleScarredVTT", BattleScarredActorSheet, {
    types: ["character", "npc", "characterAgain"],
    makeDefault: true,
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("BattleScarredVTT", BattleScarredItemSheet, { makeDefault: true });
  Items.registerSheet("BattleScarredVTT", BattleScarredWeaponSheet, { 
    types: ["weapon"],
    makeDefault: true,
    label: "WeaponSheetDefault"
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Object.entries(helpers).forEach(([key, value]) => {
  Handlebars.registerHelper(key, value);
})

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
  const item = data.data;

  // Create the macro command
  const command = `game.BattleScarredVTT.rollItemMacro("${item.name}");`;
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "BattleScarredVTT.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

  // Trigger the item roll
  return item.roll();
}