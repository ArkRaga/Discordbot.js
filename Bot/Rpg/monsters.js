/// add lava Golem for noob
/// add mimic - trixiehorror
const skill = require("./skills");
const { itemDictionary } = require("./items");

const AnimalTypes = {
  ANIMAL: 0,
  MONSTER: 1,
};

class Enemy {
  constructor({
    id,
    name = "",
    type = AnimalTypes.ANIMAL,
    damage = 1,
    speed = 1,
    def = 1,
    attacks = [],
    drops = [],
    huntItem = false,
  }) {
    this.hp = 10;
    this.id = id;
    this.name = name;
    this.type = type;
    this.dmg = damage;
    this.speed = speed;
    this.def = def;
    this.attacks = [new skill.Basic(), new skill.Heal(), ...attacks];
    this.drops = drops;
    this.huntItem = huntItem;
  }
}

class Mimic extends Enemy {
  constructor() {
    super({
      id: 3,
      name: "Mimic",
      type: AnimalTypes.MONSTER,
      damage: 3,
      speed: 0,
      def: 0,
      attacks: [skill.basic],
      drops: [
        new itemDictionary.copperbar.itemClass(2),
        new itemDictionary.obsidian.itemClass(1),
      ],
    });
  }
}

class Wolf extends Enemy {
  constructor() {
    super({
      id: 0,
      name: "Wolf",
      type: AnimalTypes.ANIMAL,
      damage: 3,
      speed: 3,
      def: 1,
      attacks: [
        new skill.Basic(),
        new skill.Bite(),
        new skill.Swipe(),
        new skill.Roar(),
      ],
      drops: [
        new itemDictionary.pelt.itemClass(Math.round(Math.random() * 2 + 1)),
        new itemDictionary.sharptooth.itemClass(
          Math.round(Math.random() * 1 + 1)
        ),
      ],
      huntItem: new itemDictionary.meat.itemClass(),
    });
  }
}

class Lavagolem extends Enemy {
  constructor() {
    super({
      id: 1,
      name: "Lava Golem",
      type: AnimalTypes.MONSTER,
      damage: 5,
      speed: 1,
      def: 3,
    });
  }
}

class Bear extends Enemy {
  constructor() {
    super({
      id: 2,
      name: "Bear",
      type: AnimalTypes.ANIMAL,
      damage: 4,
      speed: 2,
      def: 3,
      attacks: [new skill.Swipe(), new skill.Roar()],
      drops: [
        new itemDictionary.pelt.itemClass(Math.round(Math.random() * 4 + 1)),
      ],
      huntItem: new itemDictionary.honey.itemClass(),
    });
  }
}

const tiger = new Enemy({});

const monsters = {
  wolf: Wolf,
  bear: Bear,
  // lavagolem: Lavagolem,
  mimic: Mimic,
};

module.exports.monsters = monsters;
module.exports.AnimalTypes = AnimalTypes;
