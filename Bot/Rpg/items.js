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
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 1, name: "Pelt", quality, quantity });
  }
}

class SharpTooth extends MaterialItem {
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 2, name: "Sharp Tooth", quality, quantity });
  }
}

class WolfBlood extends MaterialItem {
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 3, name: "Vial Wolf Blood", quality, quantity });
  }
}

class BearPaw extends MaterialItem {
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 4, name: "Bear Paw", quality, quantity });
  }
}

class CopperOre extends MaterialItem {
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 6, name: "Copper Ore", quality, quantity });
  }
}

class IronOre extends MaterialItem {
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 7, name: "Iron Ore", quality, quantity });
  }
}

class LavaOre extends MaterialItem {
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 8, name: "Lava Ore", quality, quantity });
  }
}

class Obsidian extends MaterialItem {
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 9, name: "Obsidian", quality, quantity });
  }
}

class BasicKey extends MaterialItem {
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 16, name: "Basic dungeon key", quality, quantity });
  }
}

class CopperBar extends CraftedItem {
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
  constructor(quantity) {
    super({ id: 12, name: "Good Pelt", quantity, mats: [new Pelt(3)] });
  }
}
class GreatPelt extends CraftedItem {
  constructor(quantity) {
    super({ id: 13, name: "Great Pelt", quantity, mats: [new GoodPelt(3)] });
  }
}
class PerfectPelt extends CraftedItem {
  constructor(quantity) {
    super({ id: 14, name: "Perfect Pelt", quantity, mats: [new GreatPelt(3)] });
  }
}
class MarvellousPelt extends CraftedItem {
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
  constructor() {
    super({
      id: 0,
      name: "Fur Armor",
      mats: [new Pelt(3), new SharpTooth(5)],
    });
  }
}

class MetalArmor extends CraftedItem {
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
  pelt: new ItemDictionaryEntry({
    itemClass: Pelt,
    name: "Pelt",
    id: 1,
  }),
  sharptooth: new ItemDictionaryEntry({
    itemClass: SharpTooth,
    name: "Sharp Tooth",
    id: 2,
  }),
  wolfblood: new ItemDictionaryEntry({
    itemClass: WolfBlood,
    name: "Wolf Blood",
    id: 3,
  }),
  bearpaw: new ItemDictionaryEntry({
    itemClass: BearPaw,
    name: "Bear Paw",
    id: 4,
  }),
  furarmor: new ItemDictionaryEntry({
    itemClass: FurArmor,
    name: "Fur Armor",
    id: 0,
  }),
  metalarmor: new ItemDictionaryEntry({
    itemClass: MetalArmor,
    name: "Metal Armor",
    id: 5,
  }),
  copperore: new ItemDictionaryEntry({
    itemClass: CopperOre,
    name: "Copper Ore",
    id: 6,
  }),
  ironore: new ItemDictionaryEntry({
    itemClass: IronOre,
    name: "Iron Ore",
    id: 7,
  }),
  lavaore: new ItemDictionaryEntry({
    itemClass: LavaOre,
    name: "Lava Ore",
    id: 8,
  }),
  obsidian: new ItemDictionaryEntry({
    itemClass: Obsidian,
    name: "Obsidian",
    id: 9,
  }),
  copperbar: new ItemDictionaryEntry({
    itemClass: CopperBar,
    name: "Copper Bar",
    id: 10,
  }),
  ironbar: new ItemDictionaryEntry({
    itemClass: IronBar,
    name: "Iron Bar",
    id: 11,
  }),
  goodpelt: new ItemDictionaryEntry({
    itemClass: GoodPelt,
    name: "Good Pelt",
    id: 12,
  }),
  basickey: new ItemDictionaryEntry({
    itemClass: BasicKey,
    name: "Basic dungeon key",
    id: 16,
  }),
};

module.exports.items = { Pelt, FurArmor, SharpTooth };
module.exports.ItemTypes = ItemTypes;
module.exports.itemDictionary = itemDictionary;
