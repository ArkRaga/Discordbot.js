const skill = require("./skills");
const { talents } = require("./talents");

//add in quips

class CharClass {
  constructor({
    name,
    attacks,
    damage = 0,
    gfx = false,
    quip = false,
    talent = false,
  }) {
    this.name = name;
    this.attacks = attacks;
    this.damage = damage;
    this.gfx = gfx;
    this.quip = quip;
    this.talent = talent;
  }
}

class Werewolf extends CharClass {
  constructor() {
    super({
      name: "werewolf",
      attacks: [skill.roar, skill.swordstrike],
      damage: 3,
      gfx: { main: "Werewolf.png" },
      quip: "The moon is full tonight.",
    });
  }
}

class Knight extends CharClass {
  constructor() {
    super({
      name: "Knight",
      attacks: [skill.roar, skill.swordstrike],
      damage: 3,
      gfx: { main: "Knight.png" },
      quip: "For the Queen",
    });
  }
}

class Priest extends CharClass {
  constructor() {
    super({
      name: "Priest",
      attacks: [skill.roar, skill.swordstrike],
      damage: 3,
      gfx: { main: "Priest.png" },
      quip: "The light has shown us the true victor.",
      talent: new talents.HealOnTurn(),
    });
  }
}

class Startclass extends CharClass {
  constructor() {
    super({
      name: "StartClass",
      attacks: [skill.roar, skill.swordstrike],
      damage: 3,
      gfx: { main: "StartClass.png" },
      quip: "I shouldnt even be here",
      talent: new talents.HealOnTurn(),
    });
  }
}

const dic = {
  knight: Knight,
  startclass: Startclass,
  mage: "Mage",
  rogue: "Rogue",
  werewolf: Werewolf,
  unicorn: "Unicorn",
  paladin: "Paladin",
  ranger: "Ranger",
  scavenger: "Scavenger",
  necromancer: "NecroMancer",
  priest: Priest,
  vampire: "Vampire",
  amazon: "Amazon",
  ninja: "Ninja",
  assassin: "Assassin",
  squire: "Squire",
  terminator: "Terminator",
  gunslinger: "GunSlinger",
  jedi: "Jedi",
  reaper: "Reaper",
  golem: "Golem",
  sith: "Sith",
  elf: "Elf",
  orc: "Orc",
  hobbit: "Hobbit",
  mermaid: "Mermaid",
  bard: "Bard",
  leper: "Leper",
  barbarian: "Barabian",
  brute: "Brute",
  ghoul: "Ghoul",
  undead: "Undead",
  houndmaster: "HoundMaster",
};

module.exports = dic;
