import { openBlock as r, createElementBlock as m, createElementVNode as t, withDirectives as y, vModelText as k, normalizeClass as w, Fragment as b, renderList as v, toDisplayString as f, pushScopeId as F, popScopeId as A, createTextVNode as I, renderSlot as M, resolveComponent as u, createBlock as T, withCtx as C, createVNode as x, createCommentVNode as U } from "../module/lib/vue.esm-browser.js";
const p = (s, a) => {
  const e = s.__vccOpts || s;
  for (const [o, d] of a)
    e[o] = d;
  return e;
}, R = {
  name: "Header",
  props: ["actor"],
  computed: {
    data() {
      return this.actor.system;
    }
  }
}, L = { class: "sheet-header" }, z = ["src", "alt"], O = { class: "header-fields" }, j = { class: "charname" }, q = { class: "resources grid grid-3col" }, G = { class: "resource flex-group-center" }, J = /* @__PURE__ */ t("label", {
  for: "data.health.value",
  class: "resource-label"
}, "Health", -1), P = { class: "resource-content flexrow flex-center flex-between" }, Q = /* @__PURE__ */ t("span", null, " / ", -1), W = { class: "resource flex-group-center" }, X = /* @__PURE__ */ t("label", {
  for: "data.aether.value",
  class: "resource-label"
}, "Aether", -1), Y = { class: "resource-content flexrow flex-center flex-between" }, Z = /* @__PURE__ */ t("span", null, " / ", -1);
function K(s, a, e, o, d, l) {
  return r(), m("header", L, [
    t("img", {
      src: e.actor.img,
      alt: e.actor.name,
      class: "profile-img",
      height: "100",
      width: "100"
    }, null, 8, z),
    t("div", O, [
      t("h1", j, [
        y(t("input", {
          type: "text",
          name: "name",
          "onUpdate:modelValue": a[0] || (a[0] = (n) => e.actor.name = n),
          placeholder: "Name"
        }, null, 512), [
          [k, e.actor.name]
        ])
      ]),
      t("div", q, [
        t("div", G, [
          J,
          t("div", P, [
            y(t("input", {
              type: "text",
              name: "data.health.value",
              "onUpdate:modelValue": a[1] || (a[1] = (n) => l.data.health.value = n),
              "data-dtype": "Number"
            }, null, 512), [
              [k, l.data.health.value]
            ]),
            Q,
            y(t("input", {
              type: "text",
              name: "data.health.max",
              "onUpdate:modelValue": a[2] || (a[2] = (n) => l.data.health.max = n),
              "data-dtype": "Number"
            }, null, 512), [
              [k, l.data.health.max]
            ])
          ])
        ]),
        t("div", W, [
          X,
          t("div", Y, [
            y(t("input", {
              type: "text",
              name: "data.aether.value",
              "onUpdate:modelValue": a[3] || (a[3] = (n) => l.data.aether.value = n),
              "data-dtype": "Number"
            }, null, 512), [
              [k, l.data.aether.value]
            ]),
            Z,
            y(t("input", {
              type: "text",
              name: "data.aether.max",
              "onUpdate:modelValue": a[4] || (a[4] = (n) => l.data.aether.max = n),
              "data-dtype": "Number"
            }, null, 512), [
              [k, l.data.aether.max]
            ])
          ])
        ])
      ])
    ])
  ]);
}
const tt = /* @__PURE__ */ p(R, [["render", K]]), et = {
  name: "Tabs",
  props: ["context", "actor", "group", "tabs"],
  data() {
    return {
      currentTab: "features"
    };
  },
  methods: {
    changeTab(s) {
      if (s && s.currentTarget) {
        let a = $(s.currentTarget);
        this.currentTab = a.data("tab");
      }
      for (let [a, e] of Object.entries(this.tabs))
        this.tabs[a].active = !1;
      this.tabs[this.currentTab].active = !0;
    },
    getTabClass(s, a) {
      return `item ${s.active ? " active" : ""}`;
    }
  }
}, at = ["data-group"], st = ["data-tab"];
function ot(s, a, e, o, d, l) {
  return r(), m("nav", {
    class: w("sheet-tabs tabs tabs--" + e.group),
    "data-group": e.group
  }, [
    (r(!0), m(b, null, v(e.tabs, (n, _) => (r(), m("a", {
      key: "tab-" + e.group + "-" + _,
      onClick: a[0] || (a[0] = (...i) => l.changeTab && l.changeTab(...i)),
      class: w(l.getTabClass(n, _)),
      "data-tab": _
    }, f(n.label), 11, st))), 128))
  ], 10, at);
}
const lt = /* @__PURE__ */ p(et, [["render", ot]]);
function V(s, a) {
  const e = game.actors.get(s);
  if (e) {
    const o = e.items.get(a);
    if (o)
      return o;
  }
  return !1;
}
async function N(s, a) {
  const e = game.actors.get(s);
  return e ? await Item.create(a, { parent: e }) : !1;
}
function S(s, a) {
  const e = V(s, a);
  e && e.sheet.render(!0);
}
function B(s, a) {
  const e = V(s, a);
  e && e.delete();
}
const nt = {
  setup() {
    return {
      itemCreate: N,
      itemEdit: S,
      itemDelete: B
    };
  },
  name: "ActorFeatures",
  props: ["context", "actor"],
  computed: {
    data() {
      return this.actor;
    },
    itemBase() {
      return {
        name: "New Feature",
        type: "feature",
        data: {}
      };
    }
  },
  methods: {}
}, D = (s) => (F("data-v-740c246b"), s = s(), A(), s), ct = { class: "items-list" }, it = { class: "item flexrow items-header" }, rt = /* @__PURE__ */ D(() => /* @__PURE__ */ t("div", { class: "item-name" }, "Name", -1)), dt = { class: "item-controls" }, _t = /* @__PURE__ */ D(() => /* @__PURE__ */ t("i", { class: "fas fa-plus" }, null, -1)), mt = /* @__PURE__ */ I(" Add item"), ut = [
  _t,
  mt
], ft = ["data-item-id"], ht = { class: "item-name" }, bt = { class: "item-image" }, pt = {
  class: "rollable",
  "data-roll-type": "item"
}, gt = ["src", "title"], xt = { class: "item-controls" }, vt = ["onClick"], $t = /* @__PURE__ */ D(() => /* @__PURE__ */ t("i", { class: "fas fa-edit" }, null, -1)), yt = [
  $t
], kt = ["onClick"], Tt = /* @__PURE__ */ D(() => /* @__PURE__ */ t("i", { class: "fas fa-trash" }, null, -1)), Ct = [
  Tt
];
function Et(s, a, e, o, d, l) {
  return r(), m("ol", ct, [
    t("li", it, [
      rt,
      t("div", dt, [
        t("a", {
          onClick: a[0] || (a[0] = (n) => o.itemCreate(e.context.actor._id, l.itemBase)),
          class: "item-control item-create",
          title: "Create item",
          "data-type": "feature"
        }, ut)
      ])
    ]),
    (r(!0), m(b, null, v(e.context.features, (n, _) => (r(), m("li", {
      key: "data.features." + _,
      class: "item flexrow",
      "data-item-id": n._id
    }, [
      t("div", ht, [
        t("div", bt, [
          t("a", pt, [
            t("img", {
              src: n.img,
              title: n.name,
              width: "24",
              height: "24"
            }, null, 8, gt)
          ])
        ]),
        t("h4", null, f(n.name), 1)
      ]),
      t("div", xt, [
        t("a", {
          onClick: (i) => o.itemEdit(e.context.actor._id, n._id),
          class: "item-control item-edit",
          title: "Edit Item"
        }, yt, 8, vt),
        t("a", {
          onClick: (i) => o.itemDelete(e.context.actor._id, n._id),
          class: "item-control item-delete",
          title: "Delete Item"
        }, Ct, 8, kt)
      ])
    ], 8, ft))), 128))
  ]);
}
const wt = /* @__PURE__ */ p(nt, [["render", Et], ["__scopeId", "data-v-740c246b"]]), It = {
  name: "Tab",
  props: ["context", "actor", "tab", "group"],
  computed: {}
}, Dt = ["data-group", "data-tab"];
function Nt(s, a, e, o, d, l) {
  return r(), m("div", {
    class: w("tab " + e.tab.key + (e.tab.active ? " active" : "")),
    "data-group": e.group,
    "data-tab": e.tab.key
  }, [
    M(s.$slots, "default")
  ], 10, Dt);
}
const E = /* @__PURE__ */ p(It, [["render", Nt]]);
function St(s) {
  s.preventDefault();
  const a = s.currentTarget ?? s.target, e = a.dataset, o = this.context ? game.actors.get(this.context.actor.id) : null;
  if (e.rollType && e.rollType == "item" && o) {
    const d = a.closest(".item").dataset.itemId, l = o.items.get(d);
    if (l)
      return l.roll();
  }
  if (e.roll) {
    let d = e.label ? `[roll] ${e.label}` : "", l = o ? o.getRollData() : {}, n = new Roll(e.roll, l);
    return n.toMessage({
      speaker: o ? ChatMessage.getSpeaker({ actor: o }) : null,
      flavor: d,
      rollMode: game.settings.get("core", "rollMode")
    }), n;
  }
}
function Bt(s, a = 0, e = !1) {
  return s = parseFloat(s).toFixed(a), e && s >= 0 ? `+${s}` : s;
}
const Ft = {
  setup({ context: s }) {
    return {
      context: s,
      onRollable: St,
      numberFormat: Bt
    };
  },
  name: "Features",
  props: ["context", "actor", "tab"],
  components: {
    ActorFeatures: wt,
    Tab: E
  },
  data() {
    return this.context;
  },
  computed: {}
}, At = { class: "grid grid-3col" }, Vt = { class: "sidebar" }, Ht = { class: "abilities flexcol" }, Mt = ["data-key"], Ut = ["for", "data-roll", "data-label"], Rt = ["name", "onUpdate:modelValue"], Lt = ["data-roll", "data-label"], zt = ["data-key"], Ot = ["for", "data-roll", "data-label"], jt = ["name", "onUpdate:modelValue"], qt = ["data-roll", "data-label"], Gt = { class: "main grid-span-2" };
function Jt(s, a, e, o, d, l) {
  const n = u("ActorFeatures"), _ = u("Tab");
  return r(), T(_, {
    group: "primary",
    tab: e.tab
  }, {
    default: C(() => [
      t("section", At, [
        t("aside", Vt, [
          t("div", Ht, [
            (r(!0), m(b, null, v(e.context.system.abilities.physical, (i, c) => (r(), m("div", {
              key: "system.abilities.physical." + c + ".value",
              "data-key": c,
              class: "ability flexrow flex-group-center"
            }, [
              t("label", {
                onClick: a[0] || (a[0] = (...h) => o.onRollable && o.onRollable(...h)),
                for: "system.abilities.physical." + c + ".value",
                class: "ability-label physicalLabel resource-label rollable flexlarge align-left",
                "data-roll": "3d6-@abilities.physical." + c + ".mod",
                "data-label": i.label
              }, f(i.label), 9, Ut),
              y(t("input", {
                type: "text",
                name: "system.abilities." + c + ".value",
                "onUpdate:modelValue": (h) => i.value = h,
                "data-dtype": "Number"
              }, null, 8, Rt), [
                [k, i.value]
              ]),
              t("span", {
                class: "ability-mod rollable",
                "data-roll": "3d6-@abilities.physical." + c + ".mod",
                "data-label": i.label
              }, f(o.numberFormat(i.mod, 0, !0)), 9, Lt)
            ], 8, Mt))), 128)),
            (r(!0), m(b, null, v(e.context.system.abilities.mental, (i, c) => (r(), m("div", {
              key: "system.abilities.mental." + c + ".value",
              "data-key": c,
              class: "ability flexrow flex-group-center"
            }, [
              t("label", {
                onClick: a[1] || (a[1] = (...h) => o.onRollable && o.onRollable(...h)),
                for: "system.abilities.mental." + c + ".value",
                class: "ability-label mentalLabel resource-label rollable flexlarge align-left",
                "data-roll": "3d6-@abilities.mental." + c + ".mod",
                "data-label": i.label
              }, f(i.label), 9, Ot),
              y(t("input", {
                type: "text",
                name: "system.abilities." + c + ".value",
                "onUpdate:modelValue": (h) => i.value = h,
                "data-dtype": "Number"
              }, null, 8, jt), [
                [k, i.value]
              ]),
              t("span", {
                class: "ability-mod rollable",
                "data-roll": "3d6-@abilities.mental." + c + ".mod",
                "data-label": i.label
              }, f(o.numberFormat(i.mod, 0, !0)), 9, qt)
            ], 8, zt))), 128))
          ])
        ]),
        t("section", Gt, [
          x(n, {
            context: e.context,
            actor: e.actor
          }, null, 8, ["context", "actor"])
        ])
      ])
    ]),
    _: 1
  }, 8, ["tab"]);
}
const Pt = /* @__PURE__ */ p(Ft, [["render", Jt]]);
const Qt = {
  name: "Edtior",
  props: ["owner", "target", "content", "button", "editable", "documents", "links", "rolls", "rollData"],
  data() {
    return {
      canEdit: !1
    };
  },
  computed: {},
  methods: {
    enrichHTML() {
      const s = !!this.button, a = !!this.editable;
      return this.canEdit = s && a, TextEditor.enrichHTML(this.content || "", {
        secrets: this.owner,
        documents: this.documents ?? !0,
        links: this.links ?? !0,
        rolls: this.rolls ?? !0,
        rollData: this.rollData ?? {}
      });
    }
  }
}, Wt = (s) => (F("data-v-4ad8e2af"), s = s(), A(), s), Xt = { class: "editor-wrapper" }, Yt = { class: "editor" }, Zt = ["data-edit", "innerHTML"], Kt = {
  key: 0,
  class: "editor-edit"
}, te = /* @__PURE__ */ Wt(() => /* @__PURE__ */ t("i", { class: "fas fa-edit" }, null, -1)), ee = [
  te
];
function ae(s, a, e, o, d, l) {
  return r(), m("div", Xt, [
    t("div", Yt, [
      t("div", {
        class: "editor-content",
        "data-edit": e.target,
        innerHTML: l.enrichHTML()
      }, null, 8, Zt),
      d.canEdit ? (r(), m("a", Kt, ee)) : U("", !0)
    ])
  ]);
}
const se = /* @__PURE__ */ p(Qt, [["render", ae], ["__scopeId", "data-v-4ad8e2af"]]), oe = {
  name: "Bio",
  props: ["context", "actor", "tab"],
  computed: {
    data() {
      return this.actor;
    }
  },
  components: {
    Tab: E,
    Editor: se
  }
};
function le(s, a, e, o, d, l) {
  const n = u("Editor"), _ = u("Tab");
  return r(), T(_, {
    group: "primary",
    tab: e.tab
  }, {
    default: C(() => [
      x(n, {
        button: "true",
        target: "data.biography",
        content: e.context.data.biography,
        rollData: e.context.rollData,
        owner: e.context.owner,
        editable: e.context.editable
      }, null, 8, ["content", "rollData", "owner", "editable"])
    ]),
    _: 1
  }, 8, ["tab"]);
}
const ne = /* @__PURE__ */ p(oe, [["render", le]]), ce = {
  setup() {
    return {
      itemCreate: N,
      itemEdit: S,
      itemDelete: B
    };
  },
  name: "Items",
  props: ["context", "actor", "tab"],
  computed: {
    data() {
      return this.actor;
    },
    itemBase() {
      return {
        name: "New Item",
        type: "item",
        data: {}
      };
    }
  },
  methods: {},
  components: {
    Tab: E
  }
}, ie = { class: "items-list" }, re = { class: "item flexrow items-header" }, de = /* @__PURE__ */ t("div", { class: "item-name" }, "Name", -1), _e = { class: "item-controls" }, me = /* @__PURE__ */ t("i", { class: "fas fa-plus" }, null, -1), ue = /* @__PURE__ */ I(" Add item"), fe = [
  me,
  ue
], he = ["data-item-id"], be = { class: "item-name" }, pe = { class: "item-image" }, ge = {
  class: "rollable",
  "data-roll-type": "item"
}, xe = ["src", "title"], ve = { class: "item-formula item-prop" }, $e = { class: "item-controls" }, ye = ["onClick"], ke = /* @__PURE__ */ t("i", { class: "fas fa-edit" }, null, -1), Te = [
  ke
], Ce = ["onClick"], Ee = /* @__PURE__ */ t("i", { class: "fas fa-trash" }, null, -1), we = [
  Ee
];
function Ie(s, a, e, o, d, l) {
  const n = u("Tab");
  return r(), T(n, {
    group: "primary",
    tab: e.tab
  }, {
    default: C(() => [
      t("ol", ie, [
        t("li", re, [
          de,
          t("div", _e, [
            t("a", {
              onClick: a[0] || (a[0] = (_) => o.itemCreate(e.context.actor._id, l.itemBase)),
              class: "item-control item-create",
              title: "Create item",
              "data-type": "item"
            }, fe)
          ])
        ]),
        (r(!0), m(b, null, v(e.context.gear, (_, i) => (r(), m("li", {
          key: "data.items." + i,
          class: "item flexrow",
          "data-item-id": _._id
        }, [
          t("div", be, [
            t("div", pe, [
              t("a", ge, [
                t("img", {
                  src: _.img,
                  title: _.name,
                  width: "24",
                  height: "24"
                }, null, 8, xe)
              ])
            ]),
            t("h4", null, f(_.name), 1)
          ]),
          t("div", ve, f(_.data.formula ?? ""), 1),
          t("div", $e, [
            t("a", {
              onClick: (c) => o.itemEdit(e.context.actor._id, _._id),
              class: "item-control item-edit",
              title: "Edit Item"
            }, Te, 8, ye),
            t("a", {
              onClick: (c) => o.itemDelete(e.context.actor._id, _._id),
              class: "item-control item-delete",
              title: "Delete Item"
            }, we, 8, Ce)
          ])
        ], 8, he))), 128))
      ])
    ]),
    _: 1
  }, 8, ["tab"]);
}
const De = /* @__PURE__ */ p(ce, [["render", Ie]]), Ne = {
  setup() {
    return {
      itemCreate: N,
      itemEdit: S,
      itemDelete: B
    };
  },
  name: "Spells",
  props: ["context", "actor", "tab"],
  computed: {
    data() {
      return this.actor;
    },
    itemBase() {
      return {
        name: "New Spell",
        type: "spell",
        data: {}
      };
    }
  },
  methods: {
    modifiedItemBase(s) {
      let a = this.itemBase;
      return a.name = `New Level ${s ?? 1} Spell`, a.data.spellLevel = s, a;
    }
  },
  components: {
    Tab: E
  }
}, Se = { class: "items-list" }, Be = { class: "item flexrow items-header" }, Fe = { class: "item-name" }, Ae = { class: "item-controls" }, Ve = ["onClick", "data-spell-level"], He = /* @__PURE__ */ t("i", { class: "fas fa-plus" }, null, -1), Me = /* @__PURE__ */ I(" Add item"), Ue = [
  He,
  Me
], Re = ["data-item-id"], Le = { class: "item-name" }, ze = { class: "item-image" }, Oe = {
  class: "rollable",
  "data-roll-type": "item"
}, je = ["src", "title"], qe = { class: "item-controls" }, Ge = ["onClick"], Je = /* @__PURE__ */ t("i", { class: "fas fa-edit" }, null, -1), Pe = [
  Je
], Qe = ["onClick"], We = /* @__PURE__ */ t("i", { class: "fas fa-trash" }, null, -1), Xe = [
  We
];
function Ye(s, a, e, o, d, l) {
  const n = u("Tab");
  return r(), T(n, {
    group: "primary",
    tab: e.tab
  }, {
    default: C(() => [
      t("ol", Se, [
        (r(!0), m(b, null, v(e.context.spells, (_, i) => (r(), m(b, {
          key: "data.spells." + i
        }, [
          t("li", Be, [
            t("div", Fe, "Level " + f(i), 1),
            t("div", Ae, [
              t("a", {
                onClick: (c) => o.itemCreate(e.context.actor._id, l.modifiedItemBase(i)),
                class: "item-control item-create",
                title: "Create item",
                "data-type": "spell",
                "data-spell-level": i
              }, Ue, 8, Ve)
            ])
          ]),
          (r(!0), m(b, null, v(_, (c, h) => (r(), m("li", {
            key: "data.spells." + i + "." + h,
            class: "item flexrow",
            "data-item-id": c._id
          }, [
            t("div", Le, [
              t("div", ze, [
                t("a", Oe, [
                  t("img", {
                    src: c.img,
                    title: c.name,
                    width: "24",
                    height: "24"
                  }, null, 8, je)
                ])
              ]),
              t("h4", null, f(c.name), 1)
            ]),
            t("div", qe, [
              t("a", {
                onClick: (g) => o.itemEdit(e.context.actor._id, c._id),
                class: "item-control item-edit",
                title: "Edit Item"
              }, Pe, 8, Ge),
              t("a", {
                onClick: (g) => o.itemDelete(e.context.actor._id, c._id),
                class: "item-control item-delete",
                title: "Delete Item"
              }, Xe, 8, Qe)
            ])
          ], 8, Re))), 128))
        ], 64))), 128))
      ])
    ]),
    _: 1
  }, 8, ["tab"]);
}
const Ze = /* @__PURE__ */ p(Ne, [["render", Ye]]);
function Ke(s, a) {
  s.preventDefault();
  const e = s.currentTarget ?? s.target, o = e.closest("li"), d = o.dataset.effectId ? a.effects.get(o.dataset.effectId) : null;
  switch (e.dataset.action) {
    case "create":
      return a.createEmbeddedDocuments("ActiveEffect", [{
        label: "New Effect",
        icon: "icons/svg/aura.svg",
        origin: a.uuid,
        "duration.rounds": o.dataset.effectType === "temporary" ? 1 : void 0,
        disabled: o.dataset.effectType === "inactive"
      }]);
    case "edit":
      return d.sheet.render(!0);
    case "delete":
      return d.delete();
    case "toggle":
      return d.update({ disabled: !d.data.disabled });
  }
}
const ta = {
  name: "ActiveEffects",
  props: ["context", "actor", "tab"],
  computed: {
    // Add a computed property to use game.i18n.localize in templates.
    game() {
      return game;
    }
  },
  methods: {
    manageEffect(s) {
      let a = game.actors.get(this.context.actor._id);
      a && Ke(s, a);
    }
  },
  components: {
    Tab: E
  }
}, ea = { class: "items-list effects-list" }, aa = ["data-effect-type"], sa = { class: "item-name effect-name flexrow" }, oa = /* @__PURE__ */ t("div", { class: "effect-source" }, "Source", -1), la = /* @__PURE__ */ t("div", { class: "effect-source" }, "Duration", -1), na = { class: "item-controls effect-controls flexrow" }, ca = /* @__PURE__ */ t("i", { class: "fas fa-plus" }, null, -1), ia = /* @__PURE__ */ I(" Add effect"), ra = [
  ca,
  ia
], da = { class: "item-list" }, _a = ["data-effect-id"], ma = { class: "item-name effect-name flexrow" }, ua = ["src", "title"], fa = { class: "effect-source" }, ha = { class: "effect-duration" }, ba = { class: "item-controls effect-controls flexrow" }, pa = /* @__PURE__ */ t("i", { class: "fas fa-edit" }, null, -1), ga = [
  pa
], xa = /* @__PURE__ */ t("i", { class: "fas fa-trash" }, null, -1), va = [
  xa
];
function $a(s, a, e, o, d, l) {
  const n = u("Tab");
  return r(), T(n, {
    group: "primary",
    tab: e.tab
  }, {
    default: C(() => [
      t("ol", ea, [
        (r(!0), m(b, null, v(e.context.effects, (_, i) => (r(), m(b, {
          key: "data.effects." + i
        }, [
          t("li", {
            class: "items-header flexrow",
            "data-effect-type": _.type
          }, [
            t("h3", sa, f(l.game.i18n.localize(_.label)), 1),
            oa,
            la,
            t("div", na, [
              t("a", {
                onClick: a[0] || (a[0] = (...c) => l.manageEffect && l.manageEffect(...c)),
                "data-action": "create",
                class: "effect-control",
                title: "Create effect"
              }, ra)
            ])
          ], 8, aa),
          t("ol", da, [
            (r(!0), m(b, null, v(_.effects, (c, h) => (r(), m("li", {
              key: "data.effects." + i + "." + h,
              class: "item effect flexrow",
              "data-effect-id": c._id
            }, [
              t("div", ma, [
                t("img", {
                  class: "item-image",
                  src: c.icon,
                  title: c.label,
                  width: "24",
                  height: "24"
                }, null, 8, ua),
                t("h4", null, f(c.label), 1)
              ]),
              t("div", fa, f(c.sourceName), 1),
              t("div", ha, f(c.duration.label), 1),
              t("div", ba, [
                t("a", {
                  onClick: a[1] || (a[1] = (...g) => l.manageEffect && l.manageEffect(...g)),
                  "data-action": "toggle",
                  class: "effect-control",
                  title: "Toggle Effect"
                }, [
                  t("i", {
                    class: w("fas " + (c.disabled ? "fa-check" : "fa-times"))
                  }, null, 2)
                ]),
                t("a", {
                  onClick: a[2] || (a[2] = (...g) => l.manageEffect && l.manageEffect(...g)),
                  "data-action": "edit",
                  class: "effect-control",
                  title: "Edit Effect"
                }, ga),
                t("a", {
                  onClick: a[3] || (a[3] = (...g) => l.manageEffect && l.manageEffect(...g)),
                  "data-action": "delete",
                  class: "effect-control",
                  title: "Delete Effect"
                }, va)
              ])
            ], 8, _a))), 128))
          ])
        ], 64))), 128))
      ])
    ]),
    _: 1
  }, 8, ["tab"]);
}
const ya = /* @__PURE__ */ p(ta, [["render", $a]]);
const ka = {
  name: "CharacterSheet",
  props: ["msg", "actor", "context"],
  data(s, a, e) {
    return console.log("this is data() on the sheet.vue", this, s, a, e), {
      tabs: {
        primary: {
          features: {
            key: "features",
            active: !0,
            label: "Features"
          },
          description: {
            key: "description",
            active: !1,
            label: "Description"
          },
          items: {
            key: "items",
            active: !1,
            label: "Items"
          },
          spells: {
            key: "spells",
            active: !1,
            label: "Spells"
          },
          effects: {
            key: "effects",
            active: !1,
            label: "Effects"
          }
        }
      }
    };
  },
  components: {
    Header: tt,
    Tabs: lt,
    Features: Pt,
    Bio: ne,
    Items: De,
    Spells: Ze,
    ActiveEffects: ya
  },
  methods: {}
}, Ta = { class: "sheet-body" };
function Ca(s, a, e, o, d, l) {
  const n = u("Header"), _ = u("Tabs"), i = u("Features"), c = u("Bio"), h = u("Items"), g = u("Spells"), H = u("ActiveEffects");
  return r(), m(b, null, [
    x(n, {
      actor: e.context.actor
    }, null, 8, ["actor"]),
    x(_, {
      actor: e.context.actor,
      group: "primary",
      tabs: d.tabs.primary
    }, null, 8, ["actor", "tabs"]),
    t("section", Ta, [
      x(i, {
        context: e.context,
        actor: e.actor,
        tab: d.tabs.primary.features
      }, null, 8, ["context", "actor", "tab"]),
      x(c, {
        context: e.context,
        tab: d.tabs.primary.description
      }, null, 8, ["context", "tab"]),
      x(h, {
        context: e.context,
        tab: d.tabs.primary.items
      }, null, 8, ["context", "tab"]),
      x(g, {
        context: e.context,
        tab: d.tabs.primary.spells
      }, null, 8, ["context", "tab"]),
      x(H, {
        context: e.context,
        tab: d.tabs.primary.effects
      }, null, 8, ["context", "tab"])
    ])
  ], 64);
}
const wa = /* @__PURE__ */ p(ka, [["render", Ca], ["__scopeId", "data-v-c14c8d6c"]]);
export {
  wa as CharacterSheet,
  se as Editor,
  E as Tab,
  lt as Tabs
};
//# sourceMappingURL=components.vue.es.js.map
