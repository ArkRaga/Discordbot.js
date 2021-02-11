const { dic } = require("../../Combat/rpgCombat");
const { inventorys } = require("../../Rpg/inventory");

class Room {
  constructor(exits, num, type) {
    this.roomNumber = num;
    this.exits = exits;
    this.type = type;
  }
  print() {
    console.log(
      `This is rm ${this.roomNumber}, with ${this.exits.length} exits`
    );
  }

  Do() {}
}

class BasicRoom extends Room {
  constructor(exits, num, type) {
    super(exits, num, type);
  }
  Do(message) {
    message.channel.send(
      "You have reach a empty room, take the time to rest and change items"
    );
  }
}

class CombatRoom extends Room {
  constructor(exits, num, type) {
    super(exits, num, type);
    this.enemies = [];
  }

  addEnmeies(en) {
    return this.enemies.push(en);
  }
  removeEnemies(en) {
    return (this.enemies = this.enemies.filter((x) => x.id !== en.id));
  }
  getEnemyById(id) {
    return this.enemies.find((x) => x.id === id);
  }
  getRandomEnemy() {
    if (this.enemies.length === 0) {
      return console.log("No eneimes");
    }
    return this.enemies[Math.round(Math.random() * (this.enemies.length - 1))];
  }
  Do(message) {
    const { dic } = require("../../Combat/rpgCombat");
    return dic.huntmonster(["auto", "wolf"], message, true);
  }
}

class TreasureRoom extends Room {
  constructor(exits, num, type) {
    super(exits, num, type);
    this.items = [];
  }
  addItem(item) {
    return this.items.push(item);
  }
  removeItem(item) {
    return this.item.filter((x) => x.id !== item.id);
  }
  Do(message, item) {
    if (inventorys.hasInventory(message.author.id)) {
      let ui = inventorys.getInventory(message.author.id);
      ui.addItem(item);
      message.channel.send(`You have aquired ${item.name}`);
      return;
    }
  }
}

class BossRoom extends Room {
  constructor(exits, num, type) {
    super(exits, num, type);
    this.boss;
    this.treasure;
  }
  setBoss(en) {
    this.boss = en;
  }
  setTreasure(item) {
    this.treasure = item;
  }
  Do(message) {
    message.channel.send("Youve reached the boss rooom");
  }
}

class RestRoom extends Room {
  constructor(exits, num, type) {
    super(exits, num, type);
  }
  restUp(player) {
    player.hp = player.maxHp;
    console.log("player healed");
  }
}

const rooms = {
  BasicRoom,
  CombatRoom,
  TreasureRoom,
  BossRoom,
  RestRoom,
};
module.exports.rooms = rooms;
