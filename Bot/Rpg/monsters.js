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
    atks = [],
    drops = [],
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.dmg = damage;
    this.speed = speed;
    this.def = def;
    this.atks = atks;
    this.drops = drops;
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
      atks: [skill.bite, skill.swipe, skill.roar],
      drops: [new itemDictionary.pelt.itemClass(3)],
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
    });
  }
}

const tiger = new Enemy({});

const monsters = {
  wolf: Wolf,
  bear: Bear,
  lavagolem: Lavagolem,
};

module.exports.monsters = monsters;
module.exports.AnimalTypes = AnimalTypes;
