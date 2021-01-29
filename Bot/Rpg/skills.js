const status = {
  NONE: "none",
  BLEED: "bleed",
  STUN: "stun",
  POISON: "poison",
  CONFUSSED: "confussed",
};

const bite = {
  name: "Bite",
  dmg: 3,
  status: status.BLEED,
  msg: "bites down and thrashes about befor letting go",
};
const roar = {
  name: "Roar",
  dmg: 1,
  status: status.STUN,
  msg: "Unleashes a loud bone shaking roar",
};
const swipe = {
  name: "Swipe",
  dmg: 1,
  status: status.NONE,
  msg: "quicky strikes with their claws",
};
const swordstrike = {
  name: "Sword Strike",
  dmg: 2,
  status: status.BLEED,
  msg: "performs A heavy downward sword strike",
};

const dic = { bite, roar, swordstrike, swipe };
module.exports = dic;
