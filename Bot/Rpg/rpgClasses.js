const werewolf = {
  name: "WereWolf",
  str: 3,
  def: 1,
  speed: 4,
  mod: 25 + 4,
};

const knight = {
  name: "Knight",
  str: 2,
  def: 4,
  speed: 2,
  mod: 25 + 4,
};

const priest = {
  name: "Priest",
  str: 1,
  def: 2,
  speed: 5,
  mod: 25 + 5,
};

const startclass = {
  name: "StartClass",
  str: 0,
  def: 0,
  speed: 0,
  mod: 0,
};

const dic = {
  knight,
  startclass,
  mage: "Mage",
  rogue: "Rogue",
  werewolf,
  unicorn: "Unicorn",
  paladin: "Paladin",
  ranger: "Ranger",
  scavenger: "Scavenger",
  necromancer: "NecroMancer",
  priest,
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
};

module.exports = dic;
