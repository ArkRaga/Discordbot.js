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
}

const ItemQuality = {
  NORMAL: 'Normal',
  EPIC: 'Epico',
  RARE: 'Lets hope raga makes things actually rare',
}

class Item {
  constructor({ id, name = '' }) {
    this.id = id
    this.name = name
    this.type = ItemTypes.ITEM
  }
}

class MaterialItem extends Item {
  constructor({ id, name = '', quality = '', quantity = 1 }) {
    super({ id, name })
    this.quality = quality
    this.quantity = quantity
    this.type = ItemTypes.MATERIAL
  }
}

class CraftedItem extends Item {
  constructor({ id, name = '', mats = [] }) {
    super({ id, name })
    this.mats = mats
    this.type = ItemTypes.CRAFTEDITEM
  }
}

class Pelt extends MaterialItem {
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 1, name: 'Pelt', quality, quantity })
  }
}

class SharpTooth extends MaterialItem {
  constructor(quantity = 1, quality = ItemQuality.NORMAL) {
    super({ id: 3, name: 'Sharp Tooth', quality, quantity })
  }
}

class FurArmour extends CraftedItem {
  constructor() {
    super({ id: 0, name: 'Fur Armour', mats: [new Pelt(3), new SharpTooth(5)] })
  }
}

class DictionaryEntry {
  constructor({ itemClass, name, id }) {
    this.itemClass = itemClass
    this.name = name
    this.id = id
  }
}

const itemDictionary = {
  pelt: new DictionaryEntry({
    itemClass: Pelt,
    name: 'Pelt',
    id: 1,
  }),
  sharpTooth: new DictionaryEntry({
    itemClass: SharpTooth,
    name: 'Sharp Tooth',
    id: 3,
  }),
  furArmour: new DictionaryEntry({
    itemClass: FurArmour,
    name: 'Fur Armour',
    id: 0,
  }),
}

module.exports.items = { Pelt, FurArmour, SharpTooth }
module.exports.ItemTypes = ItemTypes
module.exports.itemDictionary = itemDictionary
