const { itemDictionary } = require("./items");

const goods = "reqs";

const quesType = {
  FETCH: "fetch",
  CRAFTING: "crafting",
  HUNTING: "hunting",
};

/*
quest:{
    name: of quest,
    description: what todo,
    reward: []
}
*/

class Quest {
  constructor({ id, name, type, desc, reqs, rewards }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.desc = desc;
    this.reqs = reqs;
    this.rewards = rewards;
  }
  print() {
    return this;
  }
}

class Peltforpelt extends Quest {
  constructor() {
    super({
      id: 1,
      name: "Pelt for a pelt",
      type: quesType.FETCH,
      desc: "bring 10 normal quailty pelts",
      reqs: [new itemDictionary.pelt.itemClass(10)],
      rewards: [new itemDictionary.furarmor.itemClass()],
    });
  }
}

class Bringmeore extends Quest {
  constructor() {
    super({
      id: 2,
      name: "Bring me Ore",
      type: quesType.FETCH,
      desc: "Bring 15 copper ore",
      reqs: [new itemDictionary.copperore.itemClass(15)],
      rewards: [new itemDictionary.copperbar.itemClass(3)],
    });
  }
}

module.exports.quests = {
  peltforpelt: Peltforpelt,
  bringmeore: Bringmeore,
};
