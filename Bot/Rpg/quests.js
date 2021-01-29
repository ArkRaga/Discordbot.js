const { itemDictionary } = require("./items");

const goods = "theItemsOrThingsYouNeedToBringMeToCompleteThisQuest";

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
  desc: "bring 10 normal quailty pelts",
  theItemsOrThingsYouNeedToBringMeToCompleteThisQuest: [
    new itemDictionary.pelt.itemClass(10),
  ],
  rewards: [new itemDictionary.furarmor.itemClass()],
};

module.exports = {
  peltforpelt,
};
