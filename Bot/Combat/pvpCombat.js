const { userhandler } = require("../userHandler");
const Discord = require("discord.js");

const combatStatus = {
  START: "start",
  WAITING: "waiting",
  PLAYERTURN: "playerTurn",
  ENEMYTURN: "enemyTurn",
  END: "end",
};

const pvpActions = {
  0: "attack",
  1: "defend",
  2: "skill",
};

class Combat {
  constructor({ id, player, enemy }) {
    this.id = id;
    this.turn = 0;
    this.attacks = [];
    this.inputs = false;
    this.status = combatStatus.WAITING;
    this.player = player;
    this.player.damage = 0;
    this.enemy = enemy;
    this.enemy.damage = 0;
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
          this.player.hp > this.enemy.hp ? this.player.id : this.enemy.id;
      }
      if (this.player.hp <= 0) {
        this.winner = this.enemy.id;
      } else {
        this.winner = this.player.id;
      }
      return false;
    }
    return true;
  }
}

class Player {
  constructor({ id, name, bclass }) {
    this.id = id;
    this.name = name;
    this.maxHp = 10;
    this.hp = this.maxHp;
    this.skill = "swordstrike";
    this.bclass = bclass;
    this.hasHealed = false;
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
    let c = this.getcombat(combat.player.id);
    if (c) {
      return false;
    } else {
      this.combat.push(combat);
      return true;
    }
  }
  hascombat(id) {
    return this.combat.some((x) => x.id === id);
  }
  getcombat(id) {
    return this.combat.find((x) => x.player.id == id || x.enemy.id == id);
  }
  removecombat(combat) {
    let newarr = this.combat.filter((x) => x.id != combat.id);
    this.combat = newarr;
  }
}

const combatHandler = new CombatHandler();

const duel = (args, message) => {
  if (args.length <= 0) {
    return message.channel.send("Please @ someone");
  }
  const enId = args[0].slice(3, -1);
  if (enId == message.author.id) {
    return message.channel.send(
      " you cannot duel yourself, pick a real oppopent "
    );
  }
  if (!userhandler.hasUser(enId)) {
    let u = message.guild.members.cache.get(enId);
    userhandler.addUser(u.user);
  }
  if (combatHandler.hascombat(message.author.id)) {
    return message.channel.send(
      "you're already in a pvp combat, please resolve it first before picking another fight."
    );
  }
  if (combatHandler.hascombat(enId)) {
    return message.channel.send(
      " that user is in combat please wait till its resolved before picking a fight with them."
    );
  }
  const user = userhandler.getUser(message.author.id);
  const enemy = userhandler.getUser(enId);
  const p = new Player({
    id: user.id,
    name: user.name,
    bclass: user.class,
  });
  const en = new Player({
    id: enemy.id,
    name: enemy.name,
    bclass: enemy.class,
  });
  const c = new Combat({ id: p.id, player: p, enemy: en });
  combatHandler.addcombat(c);

  if (enId == "792163801072009236") {
    message.channel.send(
      "you dare challenge me!, I accept your foolish request!"
    );
    c.status = pvpActions.PLAYERTURN;
    return doBigCombat(c, message);
  }
  message.channel.send(
    ` ${args[0]} You have been challenged by <@!${message.author.id}>!
    please type **!accept** or **!deny**`
  );
};

const accept = (args, message) => {
  // get the combat your apart of
  //change combat status
  // start combat
  const c = combatHandler.getcombat(message.author.id);
  if (!c) {
    return message.channel.send(
      "There are no combats for you to accept, try picking a fight"
    );
  }
  if (c.enemy.id == message.author.id) {
    c.status = combatStatus.START;
    message.channel.send("acceptes");
    doBigCombat(c, message);
  } else {
    message.channel.send("you cannot accept your own duel request");
  }
};

const doPlayersTurn = (combat, player, enemy, crit, action) => {
  let msg;
  let dmg = combat[player].damage;

  switch (action) {
    case "attack":
      msg = `${combat[player].name} attacked for ${combat[player].damage} damage \n`;
      break;
    case "defend":
      if (combat[player].hasHealed) {
        msg = `${combat[player].name} attacked for ${combat[player].damage} damage \n`;
      } else {
        combat[player].hasHealed = true;
        combat[player].hp += 2;
        dmg = 0;
        if (combat[player].hp > combat[player].maxHp) {
          combat[player].hp = combat[player].maxHp;
        }
        msg = `${combat[player].name} Healed for 2 points \n`;
      }
      break;
    case "skill":
      dmg = 4;
      msg = `${combat[player].name} performed A heavy downward sword strike for ${dmg} damage \n`;
      break;
    default:
      msg = `${combat[player].name} attacked for ${combat[player].damage} \n`;
      break;
  }
  if (crit && action !== "defend") {
    dmg = combat[player].damage += 1;
    msg = `${combat[player].name} has **critted** for ${dmg}\n`;
  }
  if (dmg === 0 && action !== "defend") {
    msg = `${combat[player].name} missed \n`;
  }
  combat[enemy].hp -= dmg;
  //   console.log(
  //     `L224-: ${combat[player].name},Hp: ${combat[player].hp} , A: ${action}, C: ${crit}, D: ${dmg}, Healed: ${combat[player].hasHealed}`
  //   );
  combat[player].damage = 0;
  return msg;
};

const doCombat = async (combat, message) => {
  let emn = require("../embeds");
  let em = emn.rpgComabtEmbed;
  em.files = [];
  combat.player.damage = Math.round(Math.random() * 3 + 0);
  combat.enemy.damage = Math.round(Math.random() * 3 + 0);
  let playerAction = pvpActions[Math.round(Math.random() * 2 + 0)];
  let enemyAction = pvpActions[Math.round(Math.random() * 2 + 0)];
  let playercrit = Math.round(Math.random() * 100 + 0) > 90 ? true : false;
  let enemycrit = Math.round(Math.random() * 100 + 0) > 90 ? true : false;

  console.log("Turn:", combat.turn);
  msg1 = doPlayersTurn(combat, "player", "enemy", playercrit, playerAction);
  msg2 = doPlayersTurn(combat, "enemy", "player", enemycrit, enemyAction);
  console.log("-----------------------");
  msg3 = `${combat.player.name} Hp: ${combat.player.hp} || ${combat.enemy.name} Hp: ${combat.enemy.hp}\n`;

  em.title = `Turn ${combat.turn} :`;
  em.description = msg1 + msg2 + msg3;
  const color = combat.player.hp >= combat.enemy.hp ? "7ED321" : "D0021B";
  em.setColor(color);
  message.channel.send(em);
  return await doAftercombat(combat, message);
};

const doBigCombat = (combat, message) => {
  //nedd 3 msg, turn, combat, end
  //forloop for doing the combat
  let combatMsg = "",
    turnMsg = "",
    endMsg = "";
  while (combat.checkHp()) {
    combat.player.damage = Math.round(Math.random() * 3 + 0);
    combat.enemy.damage = Math.round(Math.random() * 3 + 0);
    let playerAction = pvpActions[Math.round(Math.random() * 2 + 0)];
    let enemyAction = pvpActions[Math.round(Math.random() * 2 + 0)];
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
  let u = message.guild.members.cache.get(combat.winner);

  endMsg = `\n <@!${
    combat.winner
  }> has won the duel! and earned 5 battle points! \n __${
    u.user.username
  }__ : \"_${userhandler.getUser(combat.winner).class.quip}_\"`;
  const embed = new Discord.MessageEmbed()
    .setColor("fcc203")
    .setTitle(`${combat.player.name} VS ${combat.enemy.name}`)
    .setDescription(combatMsg + endMsg);
  userhandler.getUser(combat.winner).battlepoints += 5;
  combatHandler.removecombat(combat);
  message.channel.send(embed);
};

const doAftercombat = async (combat, message) => {
  const emn = require("../embeds");
  const em = Object.create(emn.rpgCombatEndEmbed);
  em.setColor("F8E71C");
  combat.checkHp();

  if (combat.winner) {
    let u = message.guild.members.cache.get(combat.winner);
    combatHandler.removecombat(combat);
    em.setColor("D0021B");
    em.setTitle(` ${u.user.username} has won the fight`);
    em.setDescription("Come back stronger and Win!");
    return await message.channel.send(em);
  }
  if (Math.round(Math.random() * 100) > 90) {
    combat.player.hp += 1;
    if (combat.player.hp > combat.player.maxHp) {
      combat.player.hp = combat.player.maxHp;
    }
    message.channel.send(
      `**${combat.player.name} class talent heals you for 1**`
    );
  }
  if (Math.round(Math.random() * 100) > 90) {
    combat.enemy.hp += 1;
    if (combat.enemy.hp > combat.enemy.maxHp) {
      combat.enemy.hp = combat.enemy.maxHp;
    }
    message.channel.send(
      `**${combat.enemy.name} class talent heals you for 1**`
    );
  }
  combat.changeTurn();
  combat.player.damage = 0;
  combat.enemy.damage = 0;
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
    return await doCombat(combat, message);
  }
};

const deny = (args, message) => {
  let c = combatHandler.getcombat(message.author.id);
  if (c.enemy.id == message.author.id) {
    combatHandler.removecombat(c);
    message.channel.send(
      `<@!${c.player.id}> your combat request has been denied!`
    );
  } else {
    message.channel.send(`you cannot deny your own request`);
  }
};

const dic = { duel, accept, deny };

module.exports.pvpcommands = dic;
