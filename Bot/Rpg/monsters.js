/// add lava Golem for noob
/// add mimic - trixiehorror
const skill = require("./skills");
const { itemDictionary } = require("./items");
const database = require("../databaseing");

const AnimalTypes = {
  ANIMAL: 0,
  MONSTER: 1,
};

class Enemy {
  constructor({
    id,
    name = "",
    type = "",
    damage = 1,
    speed = 1,
    def = 1,
    attacks = [new skill.Basic(), new skill.Heal()],
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
    this.attacks = attacks;
    this.drops = drops;
    this.huntItem = huntItem;
  }
}

const startUp = async () => {
  let mon;
  let skills;
  let drp;
  let monsterSkillStack = {};
  let monsterDropStack = {};
  await database
    .getAllMonstersFromDatabase()
    .then((ele) => {
      mon = ele;
    })
    .catch((err) => {
      return console.log("err L-39-Monsters");
    });

  if (!mon) {
    return;
  }
  await database
    .getAllCharskillsFromDatabase()
    .then((ele) => {
      skills = ele;
    })
    .catch((err) => {
      return console.log("Err L-63-Monsters");
    });

  await database
    .getAllDropsFromDatabase()
    .then((ele) => {
      drp = ele;
    })
    .catch((err) => {
      return console.log("err L-79-monsters");
    });

  skills.forEach((ele) => {
    if (ele.monster_id != null) {
      if (monsterSkillStack[ele.monster_id]) {
        monsterSkillStack[ele.monster_id].push(new skill[ele.name]());
      } else {
        monsterSkillStack[ele.monster_id] = [new skill[ele.name]()];
      }
    }
  });

  drp.forEach((ele) => {
    if (monsterDropStack[ele.monster_id]) {
      monsterDropStack[ele.monster_id].push(
        itemDictionary.createDrop(
          ele.name.split(" ").join("").toLowerCase(),
          ele.item_quantity
        )
      );
    } else {
      monsterDropStack[ele.monster_id] = [
        itemDictionary.createDrop(
          ele.name.split(" ").join("").toLowerCase(),
          ele.item_quantity
        ),
      ];
    }
  });

  mon.forEach((ele) => {
    // console.log(monsterStack[ele.monster_id]);
    dic[ele.name.toLowerCase()] = new Enemy({
      id: ele.monster_id,
      name: ele.name,
      type: ele.type,
    });
    if (monsterSkillStack[ele.monster_id]) {
      dic[ele.name.toLowerCase()].attacks = [
        ...dic[ele.name.toLowerCase()].attacks,
        ...monsterSkillStack[ele.monster_id],
      ];
    }
    dic[ele.name.toLowerCase()].drops = monsterDropStack[ele.monster_id];
  });

  console.log("Monsters", dic.wolf);
  console.log("Monsters L-113 Done");
};

const createMonster = (name) => {
  let m = dic[name.toLowerCase()];
  if (!m) {
    return;
  }
  return new Enemy({
    id: m.id,
    name: m.name,
    type: m.type,
    attacks: m.attacks,
    drops: m.drops,
    huntItem: m.huntItem,
  });
};

const dic = { createMonster };
startUp();

// class Mimic extends Enemy {
//   constructor() {
//     super({
//       id: 3,
//       name: "Mimic",
//       type: AnimalTypes.MONSTER,
//       damage: 3,
//       speed: 0,
//       def: 0,
//       attacks: [skill.basic],
//       drops: [
//         itemDictionary.createDrop("copperore", 3),
//         itemDictionary.createDrop("obsidian", 1),
//       ],
//     });
//   }
// }
// // new skill[ele.name]()
// class Wolf extends Enemy {
//   constructor() {
//     super({
//       id: 0,
//       name: "Wolf",
//       type: AnimalTypes.ANIMAL,
//       damage: 3,
//       speed: 3,
//       def: 1,
//       attacks: [
//         new skill.Basic(),
//         new skill.Bite(),
//         new skill.Swipe(),
//         new skill.Roar(),
//       ],
//       drops: [
//         itemDictionary.createDrop("pelt", Math.round(Math.random() * 2 + 1)),
//         itemDictionary.createDrop(
//           "sharptooth",
//           Math.round(Math.random() * 2 + 1)
//         ),
//       ],
//       huntItem: itemDictionary.meat,
//     });
//   }
// }

// class Lavagolem extends Enemy {
//   constructor() {
//     super({
//       id: 1,
//       name: "Lava Golem",
//       type: AnimalTypes.MONSTER,
//       damage: 5,
//       speed: 1,
//       def: 3,
//     });
//   }
// }

// class Bear extends Enemy {
//   constructor() {
//     super({
//       id: 2,
//       name: "Bear",
//       type: AnimalTypes.ANIMAL,
//       damage: 4,
//       speed: 2,
//       def: 3,
//       attacks: [new skill.Swipe(), new skill.Roar()],
//       drops: [
//         itemDictionary.createDrop("pelt", Math.round(Math.random() * 4 + 1)),
//       ],
//       huntItem: itemDictionary.honey,
//     });
//   }
// }

// const tiger = new Enemy({});

// const monsters = {
//   createMonster,
//   wolf: Wolf,
//   bear: Bear,
//   // lavagolem: Lavagolem,
//   mimic: Mimic,
// };
module.exports.monsters = dic;
module.exports.AnimalTypes = AnimalTypes;
