import { BattleScarredItem } from "./item.mjs";
import { BattleScarredWeapon } from "./items/weapon.mjs";

const handler = {
  /**
    * @param {typeof import("./item").BattleScarredItem}
    * @param {unknown[]} args
    */

    construct(_, args) {
      switch (args[0]?.type) {
       // case "armor":
          //  return new DSArmor(...args);
       // case "loot":
        //    return new DSEquipment(...args);
        case "weapon":
          return new  BattleScarredWeapon(...args);
        default:
          return new BattleScarredItem(...args);
        }
    },
};

/** @type {typeof import("./item").DSItem} */
export const BattleScarredItemProxy = new Proxy(BattleScarredItem, handler);