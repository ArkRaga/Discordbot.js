const { itemDictionary } = require("./items");

const goods = "theItemsOrThingsYouNeedToBringMeToCompleteThisQuest";

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

const peltforpelt = {
  id: 1,
  name: "Pelt for a pelt",
  type: quesType.FETCH,
  desc: "bring 10 normal quailty pelts",
  theItemsOrThingsYouNeedToBringMeToCompleteThisQuest: [
    new itemDictionary.pelt.itemClass(10),
  ],
  rewards: [new itemDictionary.furarmor.itemClass()],
};

const bringmeore = {
  id: 2,
  name: "Bring me Ore",
  type: quesType.FETCH,
  desc: "Bring 15 copper ore",
  theItemsOrThingsYouNeedToBringMeToCompleteThisQuest: [
    new itemDictionary.copperore.itemClass(15),
  ],
  rewards: [new itemDictionary.copperbar.itemClass(3)],
};

module.exports = {
  peltforpelt,
  bringmeore,
};
