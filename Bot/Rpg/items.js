/*
item: {
    id:
    name:
    quantity:
    type: [Item, material]
    quality:
}
*/

const ItemTypes = {
  MATERIAL: 0,
  CRAFTEDITEM: 1,
  ITEM: 2,
};

const ItemQuality = {
  NORMAL: "Normal",
  GOOD: "Good",
  GREAT: "Great",
  PERFECT: "Perfect",
  MARVELLOUS: "Marvellous",
  EPIC: "Epic",
  RARE: "rare",
};

class Item {
  constructor({ id, name = "" }) {
    this.id = id;
    this.name = name;
    this.type = ItemTypes.ITEM;
  }
}

class MaterialItem extends Item {
  constructor({ id, name = "", quality = "", quantity = 1 }) {
    super({ id, name });
    this.quality = quality;
    this.quantity = quantity;
    this.type = ItemTypes.MATERIAL;
  }
}

class CraftedItem extends Item {
  constructor({ id, name = "", quantity = 1, mats = [] }) {
    super({ id, name });
    this.quantity = quantity;
    this.mats = mats;
    this.type = ItemTypes.CRAFTEDITEM;
  }
}

class Pelt extends MaterialItem {
  static id = 1;
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 1, name: "Pelt", quality, quantity });
  }
}

class SharpTooth extends MaterialItem {
  static id = 2;
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 2, name: "Sharp Tooth", quality, quantity });
  }
}

class WolfBlood extends MaterialItem {
  static id = 3;
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 3, name: "Vial Wolf Blood", quality, quantity });
  }
}

class BearPaw extends MaterialItem {
  static id = 4;
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 4, name: "Bear Paw", quality, quantity });
  }
}

class CopperOre extends MaterialItem {
  static id = 6;
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 6, name: "Copper Ore", quality, quantity });
  }
}

class IronOre extends MaterialItem {
  static id = 7;
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 7, name: "Iron Ore", quality, quantity });
  }
}

class LavaOre extends MaterialItem {
  static id = 8;
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 8, name: "Lava Ore", quality, quantity });
  }
}

class Obsidian extends MaterialItem {
  static id = 9;
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 9, name: "Obsidian", quality, quantity });
  }
}

class BasicKey extends MaterialItem {
  static id = 16;
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 16, name: "Basic dungeon key", quality, quantity });
  }
}

class Meat extends MaterialItem {
  static id = 17;
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 17, name: "Meat", quantity, quality });
  }
}

class Honey extends MaterialItem {
  static id = 18;
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 18, name: "Honey", quantity, quality });
  }
}

class CopperBar extends CraftedItem {
  static id = 10;
  constructor(quantity = 1) {
    super({
      id: 10,
      name: "Copper Bar",
      quantity,
      mats: [new CopperOre(4)],
    });
  }
}

class IronBar extends CraftedItem {
  static id = 11;
  constructor(quantity) {
    super({
      id: 11,
      name: "Iron Bar",
      quantity,
      mats: [new CopperBar(1), new IronOre(4)],
    });
  }
}

class GoodPelt extends CraftedItem {
  static id = 12;
  constructor(quantity) {
    super({ id: 12, name: "Good Pelt", quantity, mats: [new Pelt(3)] });
  }
}
class GreatPelt extends CraftedItem {
  static id = 13;
  constructor(quantity) {
    super({ id: 13, name: "Great Pelt", quantity, mats: [new GoodPelt(3)] });
  }
}
class PerfectPelt extends CraftedItem {
  static id = 14;
  constructor(quantity) {
    super({ id: 14, name: "Perfect Pelt", quantity, mats: [new GreatPelt(3)] });
  }
}
class MarvellousPelt extends CraftedItem {
  static id = 15;
  constructor(quantity) {
    super({
      id: 15,
      name: "Marvellous Pelt",
      quantity,
      mats: [new PerfectPelt(3)],
    });
  }
}

class FurArmor extends CraftedItem {
  static id = 0;
  constructor() {
    super({
      id: 0,
      name: "Fur Armor",
      mats: [new Pelt(3), new SharpTooth(5)],
    });
  }
}

class MetalArmor extends CraftedItem {
  static id = 5;
  constructor() {
    super({
      id: 5,
      name: "Metal Armor",
      mats: [new CopperBar(3), new IronBar(3)],
    });
  }
}

class ItemDictionaryEntry {
  constructor({ itemClass, name, id }) {
    this.itemClass = itemClass;
    this.name = name;
    this.id = id;
  }
}

const itemDictionary = {
  pelt: Pelt,
  sharptooth: SharpTooth,
  wolfblood: WolfBlood,
  bearpaw: BearPaw,
  furarmor: FurArmor,
  metalarmor: MetalArmor,
  copperore: CopperOre,
  ironore: IronOre,
  lavaore: LavaOre,
  obsidian: Obsidian,
  copperbar: CopperBar,
  ironbar: IronBar,
  goodpelt: GoodPelt,
  basickey: BasicKey,
  meat: Meat,
  honey: Honey,
};

module.exports.items = { Pelt, FurArmor, SharpTooth };
module.exports.ItemTypes = ItemTypes;
module.exports.itemDictionary = itemDictionary;
