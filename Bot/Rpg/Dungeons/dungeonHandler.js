const { td } = require("./dungeons");
const { inventorys } = require("../inventory");
const { itemDictionary } = require("../items");
const discord = require("discord.js");

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
  dungeonHandler.addDungeons(d);

  let r = d.rooms[0];
  afterRun(r, message, d);
};

const afterRun = (r, message, dun) => {
  console.log("Dungonehandler-L65: after run");
  const embed = new discord.MessageEmbed();
  const room = r;
  let msg = "";
  let roomLabel = room.roomNumber === 1 ? "Entrance" : room.type;
  embed.setTitle(`Current room: ${roomLabel}`);
  embed.setDescription(dun.msg);
  if (!dun.isAlive) {
    embed.setDescription(dun.msg);
    embed.setTitle("Dungeon Failed");
    dungeonHandler.deleteDungeon(message.author.id);
    return message.channel.send(embed);
  }
  if (room.exits === false) {
    let msg = room.giveItem(message);
    let finalmsg = `You have beaten the Boss and completed the dungeon\n`;
    embed.setDescription(dun.msg + finalmsg + msg);
    embed.setTitle("Dungeon Complete");
    embed
      .attachFiles(`./gfxs/${r.boss.name}.png`)
      .setThumbnail(`attachment://${r.boss.name}.png`);
    dungeonHandler.deleteDungeon(message.author.id);
    return message.channel.send(embed);
  }

  room.exits.forEach((x) => (msg += ` room: ${x}\n`));
  msg += "please type ! goto and the number\n";
  embed.addFields({ name: "Rooms: ", value: msg });
  message.channel.send(embed);
};

const goto = async (args, message) => {
  console.log("Dungonehandler-L97: goto");
  const dun = dungeonHandler.getDungeon(message.author.id);
  const prevRoom = dun.rooms.find((x) => x.roomNumber == dun.player.pos);
  const roomToGo = dun.rooms.find((x) => x.roomNumber == args[0]);
  if (!prevRoom.exits.some((x) => x == args[0])) {
    message.channel.send(`not a vaild room.`);
    return await afterRun(prevRoom, message, dun);
  }
  if (roomToGo) {
    dun.player.pos = roomToGo.roomNumber;
    // message.channel.send(`you moved to room ${roomToGo.roomNumber}`);
    await (dun.msg = roomToGo.Do(message, dun));
    // return await onRoomDone(message);
    console.log("Dungonehandler-L110: after combat");
    return await afterRun(roomToGo, message, dun);
  } else {
    return await message.channel.send(`get fucked`);
  }
};

const onRoomDone = (message) => {
  const dun = dungeonHandler.getDungeon(message.author.id);
  if (!dun.isAlive) {
    message.channel.send(dun.msg);
    return;
  }
  const prevRoom = dun.rooms.find((x) => x.roomNumber == dun.player.pos);
  return afterRun(prevRoom, message, dun);
};

const dic = {
  run,
  goto,
  onRoomDone,
};

module.exports.dungeonCommands = dic;
module.exports.dungeonHandler = dungeonHandler;
