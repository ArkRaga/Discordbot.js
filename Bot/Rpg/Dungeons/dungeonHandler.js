const { td } = require("./dungeons");
const { inventorys } = require("../inventory");
const { itemDictionary } = require("../items");

class DungeonHandler {
  constructor() {
    this.dungeons = [];
  }
  addDungeons(dungeon) {
    this.dungeons.push(dungeon);
  }
  getDungeon(id) {
    return this.dungeons.find((x) => x.player.id === id);
  }
  hasDungeon(id) {
    return this.dungeons.some((x) => x.player.id === id);
  }
  deleteDungeon(id) {
    this.dungeons = this.dungeons.filter((x) => x.player.id !== id);
    return;
  }
}

const dungeonHandler = new DungeonHandler();

const run = (args, message) => {
  const d = td;
  if (dungeonHandler.getDungeon(message.author.id)) {
    return message.channel.send("You are already in a Dungeon");
  }
  if (d.needkey === true) {
    //check for key
    let inv = inventorys.getInventory(message.author.id);
    if (!inv) {
      return message.channel.send(`Sorry but you need ${d.key.name} to enter`);
    }
    if (inv.hasItem(d.key)) {
      item = inv.getItem(d.key);
      if (item.quantity === 1) {
        inv.removeItem(item);
      } else {
        item.quantity -= 1;
      }
    } else {
      return message.channel.send(`Sorry but you need ${d.key.name} to enter`);
    }
  }
  const p = {
    id: message.author.id,
    name: message.author.username,
    bclass: "startClass",
    hp: 10,
    maxHp: 10,
  };
  p.pos = 1;
  d.addPlayer(p);
  d.addBoss("aBoss");
  dungeonHandler.addDungeons(d);

  let r = d.rooms[0];
  afterRun(r, message);
};

const afterRun = (r, message) => {
  const dun = r;
  let msg = "Rooms:\n";
  if (dun.exits === false) {
    dungeonHandler.deleteDungeon(message.author.id);
    return message.channel.send(
      " Congratz you beat the boss and finished the dungeon!"
    );
  }
  dun.exits.forEach((x) => (msg += ` room: ${x}\n`));
  message.channel.send(msg);
  message.channel.send("please type ! goto and the number");
};

const goto = async (args, message) => {
  const dun = dungeonHandler.getDungeon(message.author.id);
  const prevRoom = dun.rooms.find((x) => x.roomNumber == dun.player.pos);
  const roomToGo = dun.rooms.find((x) => x.roomNumber == args[0]);
  if (!prevRoom.exits.some((x) => x == args[0])) {
    message.channel.send(`not a vaild room.`);
    return await afterRun(prevRoom, message);
  }
  if (roomToGo) {
    dun.player.pos = roomToGo.roomNumber;
    message.channel.send(`you moved to room ${roomToGo.roomNumber}`);
    if (roomToGo.type === "combat") {
      return await roomToGo.Do(message);
    }
    await roomToGo.Do(message);
    return await onRoomDone(message);
  } else {
    return await message.channel.send(`get fucked`);
  }
};

const onRoomDone = (message) => {
  const dun = dungeonHandler.getDungeon(message.author.id);
  if (!dun) {
    return;
  }
  const prevRoom = dun.rooms.find((x) => x.roomNumber == dun.player.pos);
  return afterRun(prevRoom, message);
};

const dic = {
  run,
  goto,
  onRoomDone,
};

module.exports.dungeonCommands = dic;
module.exports.dungeonHandler = dungeonHandler;
