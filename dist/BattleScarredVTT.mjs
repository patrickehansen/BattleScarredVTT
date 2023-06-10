class h extends Actor {
  /** @override */
  prepareData() {
    super.prepareData();
  }
  /** @override */
  prepareBaseData() {
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
    const e = this;
    e.system, e.flags.battleScarredVTT, this._prepareCharacterData(e), this._prepareNpcData(e);
  }
  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(e) {
    if (e.type !== "character")
      return;
    const t = e.system;
    for (let [a, s] of Object.entries(t.abilities))
      s.mod = Math.ceil(s.value);
    t.health.max = t.abilities[t.health.complement].mod * t.health.multiplier, t.aether.max = t.abilities[t.aether.complement].mod * t.aether.multiplier, t.action.max = 30, this._prepareArmorData(e), this._prepareEncumbranceData(e), this._prepareSpellData(e);
  }
  _prepareArmorData(e) {
    e.system.armorMitigation = 0, e.system.armorHealth = {
      value: 100,
      max: 100
    };
  }
  // STR*5+END*5 = Equip Weight
  _prepareEncumbranceData(e) {
    const { str: t, end: a } = e.system.abilities;
    e.system.carry = t.mod * 5 + a.mod * 5, e.system.carriedWeight = 0, e.system.encumbrance = this._encumbrance(e.system.carriedWeight, e.system.carry), e.system.lift = this._lift(t.mod);
  }
  _prepareSpellData(e) {
    e.system.codexSlots.value = 0;
  }
  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(e) {
    e.type;
  }
  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const e = super.getRollData();
    return this._getCharacterRollData(e), this._getNpcRollData(e), e;
  }
  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(e) {
    if (this.system.type === "character" && e.abilities)
      for (let [t, a] of Object.entries(e.abilities))
        e[t] = foundry.utils.deepClone(a);
  }
  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(e) {
    this.system.type;
  }
  // Light 0-25%
  // Med 26-60%
  // Hev 61-80%
  // Enc 81-100%
  // Fuc 101%+
  _encumbrance(e, t) {
    const a = e / t * 100;
    return a === 0 ? "None" : a <= 26 ? "Light" : a <= 61 ? "Medium" : a <= 81 ? "Heavy" : a <= 100 ? "Encumbered" : "Fuuuuucked";
  }
  _lift(e) {
    const t = typeof e == "number" ? e : Number(e), a = t * 8.1 * Math.pow(1.1, t);
    return E(a, 20, 0);
  }
}
function E(r, e, t = 0) {
  return Math.ceil((r - t) / e) * e + t;
}
class f extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();
  }
  getRollContext() {
    const e = this, t = ChatMessage.getSpeaker({ actor: this.actor }), a = game.settings.get("core", "rollMode"), s = `[${e.type}] ${e.name}`;
    return {
      speaker: t,
      rollMode: a,
      defaultLabel: s
    };
  }
  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const e = this, { speaker: t, rollMode: a, defaultLabel: s } = this.getRollContext();
    if (!this.system.formula)
      ChatMessage.create({
        speaker: t,
        rollMode: a,
        flavor: s,
        content: e.system.description ?? ""
      });
    else {
      const i = this.getRollData(), l = new Roll(i.item.formula, i);
      return roll.toMessage({
        speaker: t,
        rollMode: a,
        flavor: label ?? s
      }), l;
    }
  }
  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
  getRollData() {
    if (!this.actor)
      return null;
    const e = this.actor.getRollData();
    return Object.assign(e, e.abilities), e.item = foundry.utils.deepClone(this.system), e;
  }
}
class b extends f {
  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const e = super.getRollContext(), { defaultLabel: t } = e, a = this.getRollData(), s = [
      {
        roll: new Roll("3d6 - @hitStat", a),
        label: `${t} attack`
      },
      {
        roll: new Roll("@dice + @bonus", a),
        label: `${t} damage`
      }
    ];
    return s.forEach(({ roll: i, label: l }) => {
      i.toMessage({
        speaker: e.speaker,
        rollMode: e.rollMode,
        flavor: l ?? t
      });
    }), s;
  }
  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
  getRollData() {
    var o, n;
    const e = super.getRollData(), { dice: t, bonus: a } = (o = e == null ? void 0 : e.item) == null ? void 0 : o.system.damage, s = (n = e == null ? void 0 : e.item) == null ? void 0 : n.system.equippedMode, i = e.abilities[e.item.system.dmgStat].mod, l = s === "twoHand" ? 2 : 1;
    return {
      // Value of stat used for hitting success evaluation
      hitStat: e.abilities[e.item.system.damage.hitStat].mod,
      // Damage assessment
      dice: t,
      bonus: a + i * l
    };
  }
}
function D(r, e) {
  r.preventDefault();
  const t = r.currentTarget, a = t.closest("li"), s = a.dataset.effectId ? e.effects.get(a.dataset.effectId) : null;
  switch (t.dataset.action) {
    case "create":
      return e.createEmbeddedDocuments("ActiveEffect", [{
        label: "New Effect",
        icon: "icons/svg/aura.svg",
        origin: e.uuid,
        "duration.rounds": a.dataset.effectType === "temporary" ? 1 : void 0,
        disabled: a.dataset.effectType === "inactive"
      }]);
    case "edit":
      return s.sheet.render(!0);
    case "delete":
      return s.delete();
    case "toggle":
      return s.update({ disabled: !s.data.disabled });
  }
}
function C(r) {
  const e = {
    temporary: {
      type: "temporary",
      label: "Temporary Effects",
      effects: []
    },
    passive: {
      type: "passive",
      label: "Passive Effects",
      effects: []
    },
    inactive: {
      type: "inactive",
      label: "Inactive Effects",
      effects: []
    }
  };
  for (let t of r)
    t._getSourceName(), t.data.disabled ? e.inactive.effects.push(t) : t.isTemporary ? e.temporary.effects.push(t) : e.passive.effects.push(t);
  return e;
}
var m = function() {
  return m = Object.assign || function(e) {
    for (var t, a = 1, s = arguments.length; a < s; a++) {
      t = arguments[a];
      for (var i in t)
        Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, m.apply(this, arguments);
};
function v(r) {
  return r.toLowerCase();
}
var B = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g], L = /[^A-Z0-9]+/gi;
function A(r, e) {
  e === void 0 && (e = {});
  for (var t = e.splitRegexp, a = t === void 0 ? B : t, s = e.stripRegexp, i = s === void 0 ? L : s, l = e.transform, o = l === void 0 ? v : l, n = e.delimiter, R = n === void 0 ? " " : n, c = g(g(r, a, "$1\0$2"), i, "\0"), d = 0, p = c.length; c.charAt(d) === "\0"; )
    d++;
  for (; c.charAt(p - 1) === "\0"; )
    p--;
  return c.slice(d, p).split("\0").map(o).join(R);
}
function g(r, e, t) {
  return e instanceof RegExp ? r.replace(e, t) : e.reduce(function(a, s) {
    return a.replace(s, t);
  }, r);
}
function V(r, e) {
  var t = r.charAt(0), a = r.substr(1).toLowerCase();
  return e > 0 && t >= "0" && t <= "9" ? "_" + t + a : "" + t.toUpperCase() + a;
}
function w(r, e) {
  return e === void 0 && (e = {}), A(r, m({ delimiter: "", transform: V }, e));
}
function _(r) {
  return r.charAt(0).toUpperCase() + r.substr(1);
}
function M(r) {
  return _(r.toLowerCase());
}
function T(r, e) {
  return e === void 0 && (e = {}), A(r, m({ delimiter: " ", transform: M }, e));
}
function y(r, e) {
  const t = e[r];
  return {
    className: `${r}-resource resource-container resource flex-group-center`,
    value: (t == null ? void 0 : t.value) !== void 0 ? t.value : t,
    max: (t == null ? void 0 : t.max) ?? void 0,
    label: T(r),
    valuePath: `system.${r}${(t == null ? void 0 : t.value) !== void 0 ? ".value" : ""}`,
    maxPath: `system.${r}.max`,
    type: r === "Mulligan" ? "Text" : "Number"
  };
}
class I extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return console.log("hey this is the default options", super.defaultOptions), mergeObject(super.defaultOptions, {
      classes: ["BattleScarredVTT", "sheet", "actor"],
      template: "systems/BattleScarredVTT/templates/actor/actor-sheet.hbs",
      width: 750,
      top: 200,
      left: 350,
      height: 800,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
    });
  }
  /** @override */
  get template() {
    return `systems/BattleScarredVTT/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }
  /* -------------------------------------------- */
  /** @override */
  async getData() {
    var a;
    const e = super.getData(), t = this.actor.toObject(!1);
    return e.system = t.system, e.flags = t.flags, (a = this[`_get${w(t.type)}Data`]) == null || a.call(this, e), e.rollData = e.actor.getRollData(), e.effects = C(this.actor.effects), e.biography = await TextEditor.enrichHTML(t.system.biography, { async: !0 }), e.isGM = game.users.current.isGM, console.log("hey so this is a context", e), e;
  }
  _getCharacterData(e) {
    this._prepareItems(e), this._prepareCharacterData(e);
  }
  _getNpcData(e) {
    this._prepareItems(e);
  }
  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(e) {
    for (let [t, a] of Object.entries(e.system.abilities))
      a.label = game.i18n.localize(CONFIG.BATTLESCARREDVTT.abilities.names[t]) ?? t;
    e.abilities = Object.entries(e.system.abilities).reduce((t, [a, s]) => (s.type && (t[s.type] ? (t[s.type].list[a] = s, t[s.type].sum += s.value) : t[s.type] = {
      list: {
        [a]: s
      },
      sum: s.value
    }), t), {}), e.resources = ["health", "aether", "action"].map((t) => y(t, e.system)), e.status = [
      ["injuries", "permanentInjuries", "codexSlots"],
      ["xp", "money"],
      ["armorMitigation", "armorHealth", "encumbrance"],
      ["mulligan", "carry", "lift"]
    ].map((t) => t.map(
      (a) => y(a, e.system)
    ));
  }
  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(e) {
    const t = [], a = [], s = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: []
    };
    for (let i of e.items)
      i.img = i.img || DEFAULT_TOKEN, i.type === "item" ? t.push(i) : i.type === "feature" ? a.push(i) : i.type === "spell" && i.spellLevel != null && s[i.spellLevel].push(i);
    e.gear = t, e.features = a, e.spells = s;
  }
  /* -------------------------------------------- */
  /** @override */
  activateListeners(e) {
    if (super.activateListeners(e), e.find(".item-edit").click((t) => {
      const a = $(t.currentTarget).parents(".item");
      this.actor.items.get(a.data("itemId")).sheet.render(!0);
    }), !!this.isEditable && (e.find(".item-create").click(this._onItemCreate.bind(this)), e.find(".item-delete").click((t) => {
      const a = $(t.currentTarget).parents(".item");
      this.actor.items.get(a.data("itemId")).delete(), a.slideUp(200, () => this.render(!1));
    }), e.find(".effect-control").click((t) => D(t, this.actor)), e.find(".rollable").click(this._onRoll.bind(this)), this.actor.owner)) {
      let t = (a) => this._onDragStart(a);
      e.find("li.item").each((a, s) => {
        s.classList.contains("inventory-header") || (s.setAttribute("draggable", !0), s.addEventListener("dragstart", t, !1));
      });
    }
  }
  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(e) {
    e.preventDefault();
    const t = e.currentTarget, a = t.dataset.type, s = duplicate(t.dataset), l = {
      name: `New ${a.capitalize()}`,
      type: a,
      data: s
    };
    return delete l.data.type, await Item.create(l, { parent: this.actor });
  }
  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(e) {
    e.preventDefault();
    const t = e.currentTarget, a = t.dataset;
    if (a.rollType && a.rollType == "item") {
      const s = t.closest(".item").dataset.itemId, i = this.actor.items.get(s);
      if (i)
        return i.roll();
    }
    if (a.roll) {
      let s = a.label ? `[roll] ${a.label}` : "", i = new Roll(a.roll, this.actor.getRollData());
      return i.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: s,
        rollMode: game.settings.get("core", "rollMode")
      }), i;
    }
  }
}
class S extends ItemSheet {
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
    return `systems/BattleScarredVTT/templates/item/item-${this.item.type}-sheet.hbs`;
  }
  /* -------------------------------------------- */
  /** @override */
  async getData() {
    var s;
    const e = super.getData(), t = foundry.utils.deepClone(this.item);
    e.rollData = {};
    let a = ((s = this.object) == null ? void 0 : s.parent) ?? null;
    return a && (e.rollData = a.getRollData()), e.system = foundry.utils.deepClone(t.system), e.flags = t.flags, t.system.description && (e.description = await TextEditor.enrichHTML(t.system.description, { async: !0 })), e;
  }
  /* -------------------------------------------- */
  /** @override */
  activateListeners(e) {
    e.find(".rollable").click(this._onRoll.bind(this)), this.isEditable;
  }
}
class O extends S {
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
    return "systems/BattleScarredVTT/templates/item/item-weapon-sheet.hbs";
  }
  /* -------------------------------------------- */
  /** @override */
  async getData() {
    const e = super.getData();
    e.system.hitStat = game.i18n.localize(CONFIG.BATTLESCARREDVTT.abilities.names[e.system.hitStat]), e.system.weaponType = T(e.system.weaponType), e.system.equipModes = e.system.equipModes.map((t) => ({
      label: T(t),
      equipped: !1
    }));
  }
  /* -------------------------------------------- */
  /** @override */
  activateListeners(e) {
    super.activateListeners(e);
  }
  _onRoll(e) {
    e.preventDefault();
    const t = this == null ? void 0 : this.item;
    if (t)
      return t.roll();
  }
}
const k = async function() {
  return loadTemplates([
    // Actor partials.
    "systems/BattleScarredVTT/templates/actor/parts/actor-features.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/actor-items.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/actor-spells.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/actor-effects.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/ability.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/abilitySum.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/character-header.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/character-resources.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/character-status.hbs",
    "systems/BattleScarredVTT/templates/actor/parts/resource-container.hbs"
  ]);
}, u = {};
u.foobar = {
  bas: "BATTLESCARREDVTT.bas",
  bar: "BATTLESCARREDVTT.bar"
};
u.abilities = {
  names: {
    int: "BATTLESCARREDVTT.AbilityInt",
    res: "BATTLESCARREDVTT.AbilityRes",
    emp: "BATTLESCARREDVTT.AbilityEmp",
    aet: "BATTLESCARREDVTT.AbilityAet",
    str: "BATTLESCARREDVTT.AbilityStr",
    end: "BATTLESCARREDVTT.AbilityEnd",
    agi: "BATTLESCARREDVTT.AbilityAgi",
    alt: "BATTLESCARREDVTT.AbilityAlt",
    mel: "BATTLESCARREDVTT.AbilityMel",
    acc: "BATTLESCARREDVTT.AbilityAcc"
  },
  Abbreviations: {
    int: "BATTLESCARREDVTT.AbilityIntAbbr",
    res: "BATTLESCARREDVTT.AbilityResAbbr",
    emp: "BATTLESCARREDVTT.AbilityEmpAbbr",
    aet: "BATTLESCARREDVTT.AbilityAetAbbr",
    str: "BATTLESCARREDVTT.AbilityStrAbbr",
    end: "BATTLESCARREDVTT.AbilityEndAbbr",
    agi: "BATTLESCARREDVTT.AbilityAgiAbbr",
    alt: "BATTLESCARREDVTT.AbilityAltAbbr",
    mel: "BATTLESCARREDVTT.AbilityMelAbbr",
    acc: "BATTLESCARREDVTT.AbilityAccAbbr"
  }
};
u.equipModes = {
  oneHand: "BATTLESCARREDVTT.EquipMode.OneHand",
  twoHand: "BATTLESCARREDVTT.EquipMode.TwoHand",
  offHand: "BATTLESCARREDVTT.EquipMode.OffHand"
};
const x = {
  concat: function() {
    var r = "";
    for (var e in arguments)
      typeof arguments[e] != "object" && (r += arguments[e]);
    return r;
  },
  toLowerCase: (r) => r.toLowerCase(),
  switchAbilityLabelClass: (r, ...e) => new Handlebars.SafeString(`${r}Label ${e.slice(0, -1).join(" ")}`),
  json: (r) => Handlebars.SafeString(JSON.stringify(r)),
  isDefined: (r) => r !== void 0,
  concatenate: (...r) => new Handlebars.SafeString(r.join(" "))
};
class F extends foundry.abstract.DataModel {
  static defineSchema() {
    const e = foundry.data.fields;
    return {
      biography: new e.HTMLField(),
      health: new e.SchemaField({
        value: new e.NumberField({
          required: !0,
          initial: 10,
          integer: !0
        }),
        min: new e.NumberField({
          required: !0,
          initial: 0,
          integer: !0
        }),
        max: new e.NumberField({
          required: !0,
          initial: 10,
          integer: !0
        })
      }),
      proficiencies: new e.SchemaField({
        weapons: new e.ArrayField(new e.StringField()),
        skills: new e.ArrayField(new e.StringField())
      })
    };
  }
}
Hooks.once("init", async function() {
  return game.BattleScarredVTT = {
    BattleScarredActor: h,
    BattleScarredWeapon: b,
    BattleScarredItem: f,
    rollItemMacro: j
  }, CONFIG.BATTLESCARREDVTT = u, CONFIG.Combat.initiative = {
    formula: "1d20 + @abilities.dex.mod",
    decimals: 2
  }, CONFIG.Actor.documentClass = h, CONFIG.Weapon.documentClass = b, CONFIG.Item.documentClass = f, CONFIG.Actor.systemDataModels.characterAgain = F, Actors.registerSheet("BattleScarredVTT", I, {
    types: ["character", "npc"],
    makeDefault: !0
  }), Items.unregisterSheet("core", ItemSheet), Items.registerSheet("BattleScarredVTT", S, { makeDefault: !0 }), Items.registerSheet("BattleScarredVTT", O, {
    types: ["weapon"],
    makeDefault: !0,
    label: "WeaponSheetDefault"
  }), k();
});
Object.entries(x).forEach(([r, e]) => {
  Handlebars.registerHelper(r, e);
});
Hooks.once("ready", async function() {
  Hooks.on("hotbarDrop", (r, e, t) => H(e, t));
});
async function H(r, e) {
  if (r.type !== "Item")
    return;
  if (!("data" in r))
    return ui.notifications.warn("You can only create macro buttons for owned Items");
  const t = r.data, a = `game.BattleScarredVTT.rollItemMacro("${t.name}");`;
  let s = game.macros.find((i) => i.name === t.name && i.command === a);
  return s || (s = await Macro.create({
    name: t.name,
    type: "script",
    img: t.img,
    command: a,
    flags: { "BattleScarredVTT.itemMacro": !0 }
  })), game.user.assignHotbarMacro(s, e), !1;
}
function j(r) {
  const e = ChatMessage.getSpeaker();
  let t;
  e.token && (t = game.actors.tokens[e.token]), t || (t = game.actors.get(e.actor));
  const a = t ? t.items.find((s) => s.name === r) : null;
  return a ? a.roll() : ui.notifications.warn(`Your controlled Actor does not have an item named ${r}`);
}
//# sourceMappingURL=BattleScarredVTT.mjs.map
