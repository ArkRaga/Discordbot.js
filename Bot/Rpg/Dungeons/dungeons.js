const { rooms } = require("./room");
const { monsters } = require("../monsters");
const { itemDictionary } = require("../items");

class Dungeon {
  constructor(needkey = false) {
    this.rooms = [];
    this.boss;
    this.player;
    this.isAlive = true;
    this.needkey = needkey;
    this.key = false;
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
    super(false);
    this.key = [];
    this.msg = "Welcome to test dungeon, im but a mere test.!";
  }
}

const td = new TestDungeon();
const tier1 = [
  new rooms.BasicRoom([2, 3], 1),
  new rooms.CombatRoom([5], 2, monsters.createMonster("wolf")),
  new rooms.TreasureRoom([5, 4], 3),
  new rooms.BasicRoom([5], 4),
  new rooms.BossRoom(false, 5, monsters.createMonster("bear")),
];
td.addRoom(tier1);
module.exports.td = td;
