const status = {
  NONE: "none",
  BLEED: "bleed",
  STUN: "stun",
  POISON: "poison",
  CONFUSSED: "confussed",
};

const basic = {
  name: "Attack",
  dmg: 0,
  status: status.NONE,
  msg: "attacks",
  doSkill: (combat, p1, p2) => {
    combat[p2].hp -= combat[`${p1}Damage`];
    return `attacked for ${combat[`${p1}Damage`]} damage \n`;
  },
};

const swordstrike = {
  name: "Sword Strike",
  dmg: 2,
  status: status.BLEED,
  msg: "performs A heavy downward sword strike",
  doSkill: (combat, p1, p2) => {
    combat[`${p1}Damage`] = 3;
    combat[p2].hp -= combat[`${p1}Damage`];
    return `performed A heavy downward sword strike for ${
      combat[`${p1}Damage`]
    } damage \n`;
  },
};

/*
 doSkill(comabt){
   combat.enemy.hp -= combat.playerdamage
   return "so and so did the thing and boom"
 }

*/

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

const dic = { basic, bite, roar, swordstrike, swipe };
module.exports = dic;
