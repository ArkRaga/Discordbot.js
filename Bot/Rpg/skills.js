const bite = {
  name: "Bite",
  dmg: 3,
  status: "bleed",
  msg: "bites down and thrashes about befor letting go",
};
const roar = {
  name: "Roar",
  dmg: 1,
  status: "stun",
  msg: "Unleashes a loud bone shaking roar",
};
const swipe = {
  name: "Swipe",
  dmg: 1,
  status: "none",
  msg: "quicky strikes with their claws",
};
const swordstrike = {
  name: "Sword Strike",
  dmg: 2,
  status: "bleed",
  msg: "performs A heavy downward sword strike",
};

const dic = { bite, roar, swordstrike, swipe };
module.exports = dic;
