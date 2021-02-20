const { dic } = require("../../Combat/rpgCombat");
const { inventorys } = require("../../Rpg/inventory");

class Room {
  constructor(exits, num, type = "basic") {
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
  constructor(exits, num) {
    super(exits, num, "basic");
  }
  Do(message) {
    message.channel.send(
      "You have reach a empty room, take the time to rest and change items"
    );
  }
}

class CombatRoom extends Room {
  constructor(exits, num, enemies) {
    super(exits, num, "combat");
    this.enemies = enemies;
  }
  getEnemyById(id) {
    return this.enemies.find((x) => x.id === id);
  }
  getRandomEnemy() {
    if (this.enemies.length === 0) {
      return false;
    }
    return this.enemies[Math.round(Math.random() * (this.enemies.length - 1))];
  }
  Do(message, dun) {
    const { rpgcombat } = require("../../Combat/rpgCombat");
    return rpgcombat.dungeonCombat(
      message,
      this.enemies.name.toLowerCase(),
      dun
    );
  }
}

class TreasureRoom extends Room {
  constructor(exits, num, items) {
    super(exits, num, "treasure");
    this.items = items;
  }
  Do(message) {
    if (!inventorys.hasInventory(message.author.id)) {
      inventorys.addInventory(message.author.id, message.author.username);
    }
    let ui = inventorys.getInventory(message.author.id);
    ui.addItem(this.items);
    return `You have acquired ${this.items.quantity}x ${this.items.name}`;
  }
}

class BossRoom extends Room {
  constructor(exits, num, boss, item) {
    super(exits, num, "boss");
    this.boss = boss;
    this.treasure = item;
  }
  Do(message, dun) {
    const { rpgcombat } = require("../../Combat/rpgCombat");
    // console.log("room-L75-This.boss:", this.boss.name.toLowerCase());
    return rpgcombat.dungeonCombat(message, this.boss.name.toLowerCase(), dun);
  }
  giveItem(message) {
    if (!inventorys.hasInventory(message.author.id)) {
      inventorys.addInventory(message.author.id, message.author.username);
    }
    let ui = inventorys.getInventory(message.author.id);
    ui.addItem(this.treasure);
    return `You have acquired ${this.treasure.name}\n`;
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
