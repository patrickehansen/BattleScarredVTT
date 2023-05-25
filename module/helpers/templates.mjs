/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor partials.
    "systems/BattleScarredVTT/templates/actor/parts/actor-features.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/actor-items.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/actor-spells.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/actor-effects.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/ability.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/abilitySum.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/character-resources.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/character-header.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/character-status.hbs",
  ]);
};
