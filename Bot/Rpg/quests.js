const items = require("./Items");

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
    { ...items.pelt, quanity: 10 },
  ],
  rewards: [items.furarmor],
};

const dic = {
  peltforpelt,
};

module.exports = dic;
