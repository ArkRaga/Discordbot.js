const { items } = require('./items')

const goods = 'theItemsOrThingsYouNeedToBringMeToCompleteThisQuest'

/*
quest:{
    name: of quest,
    description: what todo,
    reward: []
}
*/

const peltforpelt = {
  id: 1,
  name: 'Pelt for a pelt',
  desc: 'bring 10 normal quailty pelts',
  theItemsOrThingsYouNeedToBringMeToCompleteThisQuest: [new items.Pelt(10)],
  rewards: [new items.FurArmour()],
}

module.exports = {
  peltforpelt,
}
