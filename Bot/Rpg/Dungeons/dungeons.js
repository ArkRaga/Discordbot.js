const { rooms } = require("./room");
const { monsters } = require("../monsters");

class Dungeon {
  constructor() {
    this.rooms = [];
    this.boss;
    this.player;
  }
  addRoom(room) {
    this.rooms = room;
  }
  addPlayer(player) {
    this.player = player;
  }
  addBoss(boss) {
    this.boss = boss;
  }
}

class TestDungeon extends Dungeon {
  constructor() {
    super();
  }
}

const td = new TestDungeon();
const cR = new rooms.CombatRoom([5], 2, "combat");
cR.addEnmeies(new monsters.wolf());
const tier1 = [
  new rooms.BasicRoom([2, 3], 1, "basic"),
  cR,
  new rooms.BasicRoom([4, 5], 3, "basic"),
  new rooms.BasicRoom([5], 4, "basic"),
  new rooms.BossRoom(false, 5, "boss"),
];
td.addRoom(tier1);
module.exports.td = td;
