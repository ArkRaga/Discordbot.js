const { itemDictionary } = require("../Rpg/items");
const { monsters } = require("../Rpg/monsters");
const { inventorys } = require("../Rpg/inventory");
const { userhandler } = require("../userHandler");
const {
  dungeonCommands,
  dungeonHandler,
} = require("../Rpg/Dungeons/dungeonHandler");
const Discord = require("discord.js");
const skills = require("../Rpg/skills");

const actions = {
  START: "start",
  ONGOING: "ongoing",
  INPUT: "input",
  END: "end",
};

const battleActions = {
  1: "atk",
  2: "skill",
  3: "def",
};

const playerActions = {
  0: "attack",
  1: "defend",
  2: "skill",
};

const enemyActions = {
  0: "attack",
  1: "skill",
};

let ids = 0;

class Combat {
  constructor({ id, player, enemy }) {
    this.id = id;
    this.turn = 0;
    this.attacks = [];
    this.inputs = false;
    this.lastaction = actions.START;
    this.player = player;
    this.enemy = enemy;
    this.winner = false;
    this.atk = false;
    this.heal = false;
  }
  print() {
    console.log("combat: ", this);
  }
  addAttack(atk) {
    this.attacks.push(atk);
  }
  changeTurn() {
    this.turn += 1;
  }
  changePlayerDamage(n) {
    this.playerDamage = n;
  }
  changeEnemyDamage(n) {
    this.enemyDamage = n;
  }
  changeLastAction(a) {
    this.lastaction = actions[a];
  }
  checkHp() {
    if (this.player.hp <= 0 || this.enemy.hp <= 0) {
      //   console.log("L51- a Winner has been chosen");
      if (this.player.hp <= 0 && this.enemy.hp <= 0) {
        this.winner =
          this.player.hp > this.enemy.hp ? this.player.name : this.enemy.name;
      }
      if (this.player.hp <= 0) {
        this.winner = this.enemy.name;
      } else {
        this.winner = this.player.name;
      }
      return false;
    }
    return true;
  }
}

class Player {
  constructor({ id, name, bclass }) {
    this.discordId = id;
    this.name = name;
    this.maxHp = 10;
    this.hp = this.maxHp;
    this.damage = 0;
    this.class = bclass;
    this.lastAction = "none";
    this.attacks = bclass.attacks;
    this.isAfflicted = false;
    this.affliction = false;
  }
  print() {
    console.log("Player: ", this);
  }
  changeHp(dmg) {
    this.hp -= dmg;
  }
}

class CombatHandler {
  constructor() {
    this.combat = [];
    this.id = 0;
  }
  printcombat() {
    console.log("combat: ", this.combat);
  }
  addcombat(combat) {
    let c = this.getcombat(combat.player.discordId);
    if (c) {
      return false;
    } else {
      this.combat.push(combat);
      return true;
    }
  }
  getcombat(id) {
    let c = this.combat.filter((x) => x.player.discordId == id);
    if (c) {
      return c[0];
    } else {
      return false;
    }
  }
  removecombat(combat) {
    let newarr = this.combat.filter((x) => x.id != combat.id);
    this.combat = newarr;
  }
}

const combats = new CombatHandler();

const setUpCombat = (message, enemy) => {
  ids += 1;
  const p = new Player({
    id: message.author.id,
    name: message.author.username,
    bclass: userhandler.getUser(message.author.id).class,
  });
  // console.log("L148-rpgcombat: ", p);
  const en = monsters.createMonster(enemy);
  en.dmg = 3;
  en.isAfflicted = false;
  en.affliction = false;
  en.maxHp = en.hp;
  const c = new Combat({
    id: ids,
    player: p,
    enemy: en,
  });
  return c;
};

const hunt = async (args, message, dun = false) => {
  const chestChance = Math.round(Math.random() * 100 + 0) > 80 ? true : false;
  if (chestChance) {
    return await foundChest(args, message);
  }
  const auto = true;
  let enemy = Object.keys(monsters)[
    Math.floor(Math.random() * (Object.keys(monsters).length - 1))
  ];
  // look to see if you have the enemy item if so do that enemy
  // let enemy = args[1] ? args[1] : "bear";
  if (args.length > 0) {
    let m = Object.keys(monsters).find((x) => x === args[0] || x === args[1]);
    let en = new monsters[m]();

    //check if user has item in their inventory
    if (inventorys.hasInventory(message.author.id)) {
      if (inventorys.getInventory(message.author.id).hasItem(en.huntItem)) {
        if (
          inventorys.getInventory(message.author.id).getItem(en.huntItem)
            .quantity > 1
        ) {
          inventorys
            .getInventory(message.author.id)
            .getItem(en.huntItem).quantity -= 1;
        } else {
          inventorys.getInventory(message.author.id).removeItem(en.huntItem);
        }
        enemy = en.name.toLowerCase();
      } else {
        //doesnt have item
        return await message.channel.send(
          "You do not have the item for hunting this monster"
        );
      }
    } else {
      return await message.channel.send(
        "You do not have the item for hunting this monster"
      );
      //doesnt have inventory
    }
  }

  // console.log("Rpgcombat-L168- Enemy: ", enemy);
  enemy = "wolf";
  const c = setUpCombat(message, enemy);
  if (dun) {
    c.dun = dun;
  }
  if (combats.addcombat(c)) {
    c.turn = 0;
    c.atk = true;
    if (auto) {
      c.inputs = false;
      c.lastaction = actions.INPUT;
      // return await attacks(args, message);
      return await doBigCombat(c, message);
      // return await doRpgcombat(c, message);
    } else {
      let emn = require("../embeds");
      let em = Object.create(emn.rpgComabtEmbed);
      em.files = [];
      em.setTitle("please type __!attacks__ followed by 4 actions: ");
      em.setColor("ffce08");
      let msg1 = "**atk** - does a basic attack\n";
      let msg2 = "**def** - heals you for 2 can only be done once\n";
      let msg3 =
        "**skill** - performs your class skill, can only be done once per 4 actions\n";
      em.setDescription(msg1 + msg2 + msg3);
      c.inputs = true;
      c.lastaction = actions.INPUT;
      return await message.channel.send(em);
    }
  } else {
    return await message.channel.send(`You are in combat already`);
  }
};

const foundChest = async (args, message) => {
  let emn = require("../embeds");
  let em = emn.rpgComabtEmbed;
  em.files = [];
  const mimicChance = Math.round(Math.random() * 100 + 0) > 95 ? true : false;
  if (mimicChance) {
    let c = setUpCombat(message, new monsters.mimic());
    if (combats.addcombat(c)) {
      em.setTitle(`A wild  ${c.enemy.name} has appeard `);
      em.attachFiles(`./gfxs/${c.enemy.name}.png`).setImage(
        `attachment://${c.enemy.name}.png`
      );
      em.setColor("03fcca");
      em.setDescription("youve been bamboozeled!");
      await message.channel.send(em);
      c.turn = 1;
      c.atk = true;

      if (args[0] === "auto") {
        c.inputs = false;
        c.lastaction = actions.INPUT;
        return await attacks(args, message);
        // return await doRpgcombat(c, message);
      } else {
        let emn = require("../embeds");
        let em = emn.rpgComabtEmbed;
        em.files = [];
        em.setTitle("please type __!attacks__ followed by 4 actions: ");
        em.setColor("ffce08");
        let msg1 = "**atk** - does a basic attack\n";
        let msg2 = "**def** - heals you for 2 can only be done once\n";
        let msg3 =
          "**skill** - performs your class skill, can only be done once per 4 actions\n";
        em.setDescription(msg1 + msg2 + msg3);
        c.inputs = true;
        c.lastaction = actions.INPUT;
        return await message.channel.send(em);
      }
    } else {
      return await message.channel.send(`You are in combat already`);
    }
  }

  const item1 = itemDictionary.createDrop("pelt", 3);
  const item2 = itemDictionary.createDrop("copperore", 2);
  item1.quantity = 3;
  item2.quantity = 5;

  inventorys.addInventory(message.author.id, message.author.username);
  const inven = inventorys.getInventory(message.author.id);
  inven.addItem(item1);
  inven.addItem(item2);
  em.attachFiles(`./gfxs/Chest.png`).setThumbnail(`attachment://Chest.png`);
  em.setTitle("Riches and valueables");
  em.setColor("fbff08");
  let msg1 =
    "No monsters found, but you happend to stumble upon a chest containing: \n";
  let msg2 = `${item1.name} x${item1.quantity}\n`;
  let msg3 = `${item2.name} x${item2.quantity}\n`;
  em.setDescription(msg1 + msg2 + msg3);
  await message.channel.send(em);
};

const attacks = (args, message) => {
  var c = combats.getcombat(message.author.id);
  let skill = false;
  if (!c) {
    return message.channel.send("you are not in a combat");
  }
  if (c.lastaction !== actions.INPUT) {
    return message.channel.send("you cannot change your actions");
  }
  if (!c.inputs) {
    let num = () => battleActions[Math.round(Math.random() * 2 + 1)];
    let arr = new Array(num(), num(), num(), num());
    args = arr;
  }
  args.forEach((x, i) => {
    if (i <= 3) {
      if (x === "skill") {
        if (skill) {
          x = "atk";
        } else {
          skill = true;
        }
      }
      if (x === "def") {
        if (c.heal) {
          x = "atk";
        } else {
          c.heal = true;
        }
      }
      c.addAttack(x);
    }
  });
  c.lastaction = actions.ONGOING;
  doRpgcombat2(c, message);
  // console.log(c.attacks);
  // message.channel.send(`you inputted ${args.length} inputs.`);
};

const doEnemyDrop = (message, combat) => {
  let n = Math.round(Math.random() * (combat.enemy.drops.length - 1));
  let msg = "";
  inventorys.addInventory(message.author.id, message.author.username);
  const inven = inventorys.getInventory(message.author.id);
  if (combat.enemy.drops.length > 1) {
    combat.enemy.drops.forEach((x, i) => {
      if (i === n) {
        msg += ` **${x.name}** x${x.quantity}\n`;
        inven.addItem(x);
      }
    });
  } else {
    inven.addItem(combat.enemy.drops[0]);
    msg += ` **${combat.enemy.drops[0].name}** x${combat.enemy.drops[0].quantity}\n`;
  }
  return msg;
};

const doAftercombat = async (combat, message) => {
  const emn = require("../embeds");
  const em = Object.create(emn.rpgCombatEndEmbed);
  em.setColor("F8E71C");
  combat.checkHp();

  if (combat.winner) {
    combats.removecombat(combat);

    if (combat.winner == combat.player.name) {
      em.setTitle(`${combat.winner} has won the fight`);
      let msg1 = "you gained: \n";
      msg1 += doEnemyDrop(message, combat);
      em.setDescription(msg1);
      if (combat.dun) {
        await message.channel.send(em);
        return await dungeonCommands.onRoomDone(message);
      }
      return await message.channel.send(em);
    } else {
      em.setColor("D0021B");
      em.attachFiles(`./gfxs/Rip.png`).setImage(`attachment://Rip.png`);
      em.setTitle(`the ${combat.winner} has won the fight`);
      em.setDescription("Come back stronger and Win!");
      // if in a dungeon remove from dungeon
      dungeonHandler.deleteDungeon(message.author.id);
      return await message.channel.send(em);
    }
  }
  if (combat.player.class.talent.doTalent(combat, "player")) {
    message.channel.send("**Your class talent heals you for 1**");
  }
  combat.changeTurn();
  combat.playerDamage = 0;
  combat.enemyDamage = 0;
  if (combat.inputs) {
    if (combat.attacks.length > 0) {
      return await doRpgcombat2(combat, message);
    } else {
      combat.lastaction = actions.INPUT;
      return await message.channel.send(
        `please type **!attacks** followed by 4 attacks`
      );
    }
  } else {
    return await doRpgcombat2(combat, message);
  }
};

const doPlayersTurn = (combat, player, enemy, crit) => {
  let msg;
  let statmsg = "";
  let talentmsg = "";
  let dmg = combat[player].damage;
  console.log(
    "Combat: ",
    combat.turn,
    combat[player].name,
    combat[player].lastAction
  );
  if (combat[player].isAfflicted) {
    statmsg = combat[player].affliction.doStatus(combat, player);
  }
  switch (combat[player].lastAction) {
    case "attack":
      msg = combat[player].attacks[0].doSkill(combat, player, enemy);
      break;
    case "defend":
      if (
        combat[player].hasHealed ||
        combat[player].hp === combat[player].maxHp
      ) {
        msg = combat[player].attacks[0].doSkill(combat, player, enemy);
        combat[player].lastAction = "attack";
      } else {
        combat[player].hasHealed = true;
        msg = combat[player].attacks[1].doSkill(combat, player, enemy);
      }
      break;
    case "skill":
      if (combat[player].attacks.length > 2) {
        msg = combat[player].attacks[2].doSkill(combat, player, enemy);
      } else {
        msg = combat[player].attacks[1].doSkill(combat, player, enemy);
      }
      break;
    default:
      combat.player.lastAction = "attack";
      msg = combat[player].attacks[0].doSkill(combat, player, enemy);
      break;
  }

  if (combat[player].class) {
    if (!combat[player].class.talent) {
      talentmsg = "";
    } else {
      if (combat[player].class.talent.doTalent(combat, player)) {
        talentmsg = combat[player].class.talent.msg;
      }
    }
  }

  if (crit && combat.player.lastAction == "attack") {
    combat[player].damage += 1;
    combat[enemy].hp -= 1;
    msg = `${combat[player].name} has **critted** for ${combat[player].damage}\n`;
  }
  if (combat[player].damage === 0 && combat.player.lastAction !== "defend") {
    msg = `${combat[player].name} missed \n`;
  }
  combat[player].damage = 0;
  return talentmsg + statmsg + msg;
};

const doBigCombat = async (combat, message) => {
  //nedd 3 msg, turn, combat, end
  //forloop for doing the combat
  // console.log("L-464-rpgcombat-combat: ", combat);
  let combatMsg = "",
    turnMsg = "",
    endMsg = "";
  combatMsg = `**${combat.player.name} VS ${combat.enemy.name}**\n`;
  while (combat.checkHp()) {
    combat.player.damage = Math.round(Math.random() * 4 + 0);
    // combat.enemy.damage = Math.round(Math.random() * 1 + 0);
    combat.enemy.damage = Math.round(Math.random() * combat.enemy.dmg + 0);
    combat.player.lastAction = playerActions[Math.round(Math.random() * 2 + 0)];
    // let playerAction = playerActions[2];
    combat.enemy.lastAction =
      Math.round(Math.random() * 100) > 90 ? enemyActions[1] : enemyActions[0];

    console.log("Actions: ", combat.player.lastAction, combat.enemy.lastAction);
    let playercrit = Math.round(Math.random() * 100 + 0) > 90 ? true : false;
    let enemycrit = Math.round(Math.random() * 100 + 0) > 90 ? true : false;
    combat.changeTurn();
    turnMsg = combat.turn;
    //do both peoples turns
    combatMsg +=
      `\n` +
      `Turn: ${combat.turn}\n` +
      doPlayersTurn(combat, "player", "enemy", playercrit) +
      doPlayersTurn(combat, "enemy", "player", enemycrit) +
      `${combat.player.name} Hp: ${combat.player.hp} \\|| ${combat.enemy.name} Hp: ${combat.enemy.hp}\n`;
    //add to the message
  }
  combat.player.class.attacks.forEach((x) => x.doReset());
  let color = combat.winner === combat.player.name ? "75f542" : "bf0808";
  const embed = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle(`A wild ${combat.enemy.name} has appeard!`)
    .attachFiles(`./gfxs/${combat.enemy.name}.png`)
    .setThumbnail(`attachment://${combat.enemy.name}.png`)
    .setDescription(combatMsg);
  await message.channel.send(embed);
  return await doAftercombat(combat, message);
};

const doRpgcombat2 = (combat, message) => {
  let emn = require("../embeds");
  let s = require("../Rpg/skills");
  let em = emn.rpgComabtEmbed;
  em.files = [];
  combat.playerDamage = Math.round(Math.random() * 5 + 0);
  combat.enemyDamage = Math.round(Math.random() * combat.enemy.dmg + 0);
  // let skill = Math.round(Math.random() * 100 + 0) > 75 ? true : false;
  let crit = Math.round(Math.random() * 100 + 0) > 75 ? true : false;
  const action = combat.attacks.shift();
  let msg1, msg2, msg3;

  switch (action) {
    case "atk":
      msg1 = "you " + s.basic.doSkill(combat, "player", "enemy");
      break;
    case "def":
      combat.player.hp += 2;
      msg1 = `You Healed for 2 points \n`;
      break;
    case "skill":
      msg1 = "you " + s[combat.player.skill].doSkill(combat, "player", "enemy");
      break;
    default:
      msg1 = "you " + s.basic.doSkill(combat, "player", "enemy");
      break;
  }
  if (crit) {
    combat.enemyDamage = 4;
  }

  if (combat.playerDamage === 0 && action !== "def") {
    msg1 = `You missed \n`;
  }
  msg2 = `the ${combat.enemy.name} ${s.basic.doSkill(
    combat,
    "enemy",
    "player"
  )} \n`;
  if (crit) {
    msg2 = `the ${combat.enemy.name} has Critted for ${combat.enemyDamage} damage \n`;
  }
  if (combat.enemyDamage === 0) {
    msg2 = `${combat.enemy.name} missed \n`;
  }
  msg3 = `${combat.player.name} Hp: ${combat.player.hp} || ${combat.enemy.name} Hp: ${combat.enemy.hp}\n`;
  em.title = `Turn ${combat.turn} :`;
  em.description = msg1 + msg2 + msg3;
  const color = combat.player.hp >= combat.enemy.hp ? "7ED321" : "D0021B";
  em.setColor(color);
  message.channel.send(em);
  doAftercombat(combat, message);
};

const getmycombat = (args, message) => {
  let c = combats.getcombat(message.author.id);
  if (c) {
    console.log(c.id);
    return message.channel.send("Found!");
  } else {
    return message.channel.send("Not Found");
  }
};

const getcombat = () => {
  inventorys.print();
};

const sayhi = () => {
  console.log("HI");
};

const dungeonCombat = (message, monster, dun) => {
  const combat = setUpCombat(message, monster);
  let combatMsg = "",
    turnMsg = "",
    endMsg = "";
  while (combat.checkHp()) {
    combat.player.damage = Math.round(Math.random() * 4 + 0);
    // combat.enemy.damage = 50;
    combat.enemy.damage = Math.round(Math.random() * combat.enemy.dmg + 0);
    let playerAction = playerActions[Math.round(Math.random() * 2 + 0)];
    // let playerAction = playerActions[2];
    let enemyAction =
      Math.round(Math.random() * 100) > 75 ? enemyActions[1] : enemyActions[0];
    let playercrit = Math.round(Math.random() * 100 + 0) > 90 ? true : false;
    let enemycrit = Math.round(Math.random() * 100 + 0) > 90 ? true : false;

    combat.changeTurn();
    turnMsg = combat.turn;
    //do both peoples turns
    combatMsg +=
      `\n` +
      `Turn: ${combat.turn}\n` +
      doPlayersTurn(combat, "player", "enemy", playercrit, playerAction) +
      doPlayersTurn(combat, "enemy", "player", enemycrit, enemyAction) +
      `${combat.player.name} Hp: ${combat.player.hp} \\|| ${combat.enemy.name} Hp: ${combat.enemy.hp}\n`;
    //add to the message
  }
  combat.player.class.attacks.forEach((x) => x.doReset());

  if (combat.winner === combat.player.name) {
    dun.isAlive = true;
    let msg1 = `\n**${combat.player.name}** has won!\n`;
    msg1 += "you gained: \n";
    inventorys.addInventory(message.author.id, message.author.username);
    const inven = inventorys.getInventory(message.author.id);
    combat.enemy.drops.forEach((x) => {
      msg1 += ` **${x.name}** x${x.quantity}\n`;
      inven.addItem(x);
    });
    let titlemsg = `**${combat.player.name} VS ${combat.enemy.name}**\n`;
    let fullmsg = (titlemsg += combatMsg += msg1);
    return fullmsg;
  } else {
    dun.isAlive = false;
    let msg1 = `\n the **${combat.winner}** has won the fight\n You have been removed from the Dungeon, \ncome back stronger\n`;
    let titlemsg = `**${combat.player.name} VS ${combat.enemy.name}**\n`;
    fullmsg = titlemsg += combatMsg += msg1;
    return fullmsg;
  }
};

const dic = {
  hunt,
  getmycombat,
  getcombat,
  attacks,
  sayhi,
  dungeonCombat,
};

module.exports.rpgcombat = dic;
module.exports.player = Player;
