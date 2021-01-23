/// add lava Golem for noob
/// add mimic - trixiehorror
const skill = require("./skills");
const items = require("./items");
const wolf = {
  name: "Wolf",
  type: "animal",
  damage: 3,
  speed: 3,
  def: 1,
  atks: [skill.bite, skill.swipe, skill.roar],
  drops: [items.pelt],
};
const lavagolem = {
  name: "Lava Golem",
  type: "monster",
  damage: 5,
  speed: 1,
  def: 3,
};
const bear = {
  name: "Bear",
  type: "animal",
  damage: 4,
  speed: 2,
  def: 3,
};
const tiger = {};

const monsters = { wolf, lavagolem, bear };
module.exports = monsters;
