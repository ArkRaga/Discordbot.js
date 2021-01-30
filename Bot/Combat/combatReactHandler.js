let users = require("../userHandler").users;
let { monsters } = require("../Rpg/monsters");
let inven = require("../Rpg/inventory");
let embed = require("../embeds");

let combats = [];

const combatState = ["player1Turn", "player2Turn"];

const startcombat = async (args, message) => {
  /// checkto see if player is in combat
  // console.log("beep", args[0]);
  let id = message.author.id;
  let en = message.guild.members.cache.get(args[0].slice(3, -1));
  // console.log("bot?: ", message.author.bot);

  if (!en) {
    return await message.channel.send(
      "please pick a fight with an actual user"
    );
  } else {
    if (en.user.id == id) {
      return await message.channel.send(
        "you want to fight yourself?, cmon man...."
      );
    }
  }
  if (combats.length != 0) {
    let combat = combats.filter((x) => x.player1 == id || x.player2 == id);
    let combat2 = combats.filter(
      (x) => x.player1 == en.user.id || x.player2 == en.user.id
    );
    // console.log("combat: ", combat);
    // console.log("combat2: ", combat2);
    if (combat.length != 0 || combat2.length != 0) {
      return await message.channel.send(
        "Combat cannot be started with someone currently in combat"
      );
    }
  }
  combats.push({
    dmg: 0,
    heal: 0,
    lastaction: "",
    turn: 1,
    player1: id,
    player1name: message.author.username,
    player1hp: 10,
    player2: en.user.id,
    player2name: en.user.username,
    player2hp: 10,
    state: combatState[0],
  });

  if (en.user.id == "792163801072009236") {
    const combat = combats.filter((x) => x.player2 == "792163801072009236");
    // console.log("combat in start: ", combat, " combat arr", combats);
    await message.channel.send(
      "You dare challenge me?! I Accept your foolish request!"
    );
    combat[0].lastaction = "accept";
    return doBotCombat(combat[0], message);
  }

  let em = embed.combatEmbed;
  let arr = ["🗡️", "🏃"];
  em.title = "A fight Has been issued!";
  em.description = `${
    args[0]
  }! ${message.author.toString()} has challenged thee to fistycuffs, respond with 🗡️ to fight or 🏃 to live another day!`;
  const msg = await message.channel.send({ embed: em });
  await arr.forEach((x) => msg.react(x));

  const filter = (reaction, user) => {
    return arr.includes(reaction.emoji.name) && user.id == en.user.id;
  };
  msg
    .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
    .then((collected) => {
      const reaction = collected.first();
      if (reaction.emoji.name === "🗡️") {
        // console.log("User: ", user)
        accept(args, message, en.user.id);
      } else {
        deny(args, message, en.user.id);
      }
    })
    .catch((collected) => {
      message.reply("Time has run out");
      combats = combats.filter((x) => x.player2 != en.user.id);
    });
};

const hunt = async (args, message) => {
  let en;
  if (!args) {
    en = new monsters.wolf();
  } else {
    if (monsters.hasOwnProperty(args[0])) {
      en = new monsters[args[0]]();
    } else {
      en = new monsters.wolf();
    }
  }
  if (combats.length != 0) {
    let combat = combats.filter((x) => x.player1 == id || x.player2 == id);
    let combat2 = combats.filter(
      (x) => x.player1 == en.user.id || x.player2 == en.user.id
    );
    // console.log("combat: ", combat);
    // console.log("combat2: ", combat2);
    if (combat.length != 0 || combat2.length != 0) {
      return await message.channel.send(
        "Combat cannot be started while  currently in combat"
      );
    }
  }

  combats.push({
    monster: true,
    player1dmg: 0,
    player2dmg: 0,
    heal: 0,
    lastaction: "accept",
    turn: 1,
    player1: message.author.id,
    player1name: message.author.username,
    player1hp: 10,
    player2: en.name,
    player2name: en.name,
    en: en,
    player2hp: 10,
    state: combatState[0],
  });

  let combat = combats.filter(
    (x) => x.player1 == message.author.id || x.player2 == message.author.id
  );
  await message.channel.send(
    `<@!${message.author.id}> your fighting a **${en.name}** `
  );
  return await doBotCombat(combat[0], message);
};

const accept = async (args, message, p2id) => {
  const combat = combats.filter((x) => x.player2 == p2id);
  let em = embed.combatEmbed;
  em.title = "Lets Go!";
  em.description = `<@!${combat[0].player1}>, <@!${combat[0].player2}> Has accepted your challenge`;
  const msg = await message.channel.send({ embed: em });
  combat[0].lastaction = "accept";
  pvpCombat(combat[0], message);
};

const deny = async (args, message, p2id) => {
  // console.log("Combat to remove: ");
  combats = combats.filter((x) => x.player2 != p2id);
  return await message.channel.send("you have denied the right of combat");
};

const doHealthCheck = async (combat, message) => {
  // console.log("Dohealth ");
  if (combat.player1hp <= 0 || combat.player2hp <= 0) {
    if (combat.monster) {
      let winner = combat.player2hp <= 0 ? "player1" : "player2";
    } else {
      let winner = combat.player1hp <= 0 ? "player2" : "player1";
    }
    combats = combats.filter((x) => x.player2 != combat.player2);
    let em = embed.combatEmbed;
    em.title = " Final Turn";
    if (combat.monster) {
      em.description = ` **${
        combat[winner + "name"]
      }** delt a final blow of ** ${combat[winner + "dmg"]}** dmg `;
    } else {
      em.description = ` **${
        combat[winner + "name"]
      }** delt a final blow of ** ${combat.dmg}** dmg `;
    }
    await message.channel.send({ embed: em });
    return await doWin(combat, message, winner);
  }

  if (combat.player2 == "792163801072009236" || combat.monster) {
    return await doBotCombat(combat, message);
  }
  combat.state =
    combat.state === combatState[0] ? combatState[1] : combatState[0];
  await pvpCombat(combat, message);
};

const doWin = async (combat, message, winner) => {
  let en = winner == "player1" ? "player2" : "player1";
  let em = embed.combatEmbed;
  em.title = "It was a Battle for the Gods!";
  em.description = `Ultimately <@!${combat[winner]}>, came out with the win aginst their powerful foe <@!${combat[en]}>! the fight was a must see folks! `;
  await message.channel.send({ embed: em });
  let fighters = users.filter(
    (x) => x.discordid == combat.player1 || x.discordid == combat.player2
  );
  // console.log("Fighters: ", fighters);
  // console.log("Combat: ", combat);
  if (combat.monster) {
    if (combat[winner] != combat.en.name) {
      let i = inven.getinv(combat[winner]);
      if (!i) {
        inven.adduserinv(combat[winner], combat[winner + "name"]);
      }
      i = inven.getinv(combat[winner]);
      inven.additem(i, combat.en.drops[0]);
    }
    return;
  }
  if (fighters[0].discordid == combat.winner) {
    fighters[0].battlepoints += 3;
    fighters[1].battlepoints += 1;
  } else {
    fighters[1].battlepoints += 3;
    fighters[0].battlepoints += 1;
  }
  users.forEach((x) => {
    if (x.discordid == fighters[0].discordid) {
      x = fighters[0];
    }
    if (x.discordid == fighters[1].discordid) {
      x = fighters[1];
    }
  });
};

const createEmbed = (combat, target, en) => {
  // console.log("createEmbed");
  let em = embed.combat2Embed;
  em.title = `Turn ${combat.turn}`;
  em.fields[0].name = `${combat[en + "name"]} Hp: ${combat[en + "hp"]} || ${
    combat[target + "name"]
  } Hp: ${combat[target + "hp"]}`;
  if (combat.lastaction === "attack") {
    em.fields[0].value = `<@!${combat[en]}> has attacked <@!${combat[target]}> for **${combat.dmg} dmg **`;
  }
  if (combat.lastaction === "heal") {
    em.fields[0].value = `<@!${combat[en]}> has healed for ${combat.heal}`;
  }
  if (combat.lastaction === "accept") {
    em.fields[0].value = `
    LETS FIGHT!!!`;
  }
  em.fields[1].name = `${combat[target + "name"]} its your turn`;
  em.fields[1].value = `**🗡️** to attack or 🛡️ to Defend`;
  return em;
};

const pvpCombat = async (combat, message) => {
  // console.log("Embed Combat: ");
  let target = combat.state == combatState[1] ? "player2" : "player1";
  let en = target == "player1" ? "player2" : "player1";
  let arr = ["🗡️", "🛡️"];
  const msg = await message.channel.send({
    embed: createEmbed(combat, target, en),
  });
  await arr.forEach((x) => msg.react(x));

  const filter = (reaction, user) => {
    // console.log("turn: ", combat[target + "name"]);
    return arr.includes(reaction.emoji.name) && user.id == combat[target];
  };

  msg
    .awaitReactions(filter, { max: 1 })
    .then((collected) => {
      const reaction = collected.first();

      if (reaction.emoji.name === "🗡️") {
        let dmg = Math.floor(Math.random() * 10 + 0);
        combat[en + "hp"] -= dmg;
        combat.dmg = dmg;
        combat.turn += 1;
        combat.lastaction = "attack";
        doHealthCheck(combat, message);
      } else {
        let heal = Math.floor(Math.random() * 3 + 1);
        combat.heal = heal;
        combat.turn += 1;
        combat.lastaction = "heal";
        combat[target + "hp"] += heal;
        doHealthCheck(combat, message);
      }
    })
    .catch((collected) => {
      message.reply("there has been an err in create embed");
    });
};

const botEmbedHandler = (combat) => {
  // console.log("botembed");
  let em = embed.combat2Embed;
  let en = combat.monster ? combat.player2name : `<@!${combat.player2}>`;
  let enatk = "";
  em.title = `Turn ${combat.turn}`;
  em.fields[0].name = `${combat.player1name} Hp: ${combat.player1hp} || ${combat.player2name} Hp: ${combat.player2hp}`;

  if (combat.player2dmg === 0) {
    enatk = `${en} Has missed`;
  } else {
    enatk = `${en} Has attacked for **${combat.player2dmg} dmg **`;
  }

  if (combat.lastaction === "attack") {
    // console.log("attack action if");
    em.fields[0].value = `<@!${combat.player1}> has attacked ${en} for **${combat.player1dmg} dmg **. ${enatk}`;
  }
  if (combat.lastaction === "heal") {
    em.fields[0].value = `<@!${combat.player1}> has healed for ${combat.heal}, ${enatk}`;
  }
  if (combat.lastaction === "accept") {
    if (combat.monster) {
      em.fields[0].value = `
      LETS FIGHT!!!`;
    } else {
      em.fields[0].value = `
      Let the Pain Train begin, Chuga Chuga.`;
    }
  }
  em.fields[1].name = `${combat.player1name} its your turn`;
  em.fields[1].value = `**🗡️** to attack or 🛡️ to Defend`;
  return em;
};

const doBotCombat = async (combat, message) => {
  // console.log("Combat dobot: ", combat);
  let target = "player1";
  let en = "player2";
  let arr = ["🗡️", "🛡️"];

  const msg = await message.channel.send({
    embed: botEmbedHandler(combat),
  });
  await arr.forEach((x) => msg.react(x));

  const filter = (reaction, user) => {
    // console.log("turn: ", combat[target + "name"]);
    return arr.includes(reaction.emoji.name) && user.id == combat[target];
  };

  msg
    .awaitReactions(filter, { max: 1 })
    .then((collected) => {
      const reaction = collected.first();
      let botdmg = Math.floor(Math.random() * 10 + 0);
      combat.player2dmg = botdmg;
      if (reaction.emoji.name === "🗡️") {
        let dmg = Math.floor(Math.random() * 10 + 0);
        combat[en + "hp"] -= dmg;
        combat.player1dmg = dmg;
        combat.turn += 1;
        combat.lastaction = "attack";
        combat.player1hp -= botdmg;
        doHealthCheck(combat, message);
      } else {
        let heal = Math.floor(Math.random() * 3 + 1);
        combat.heal = heal;
        combat.turn += 1;
        combat.lastaction = "heal";
        combat[target + "hp"] += heal;
        combat.player1hp -= botdmg;
        doHealthCheck(combat, message);
      }
    })
    .catch((collected) => {
      message.reply("there has been an err in create embed");
    });
};

const getcombat = async (args, message) => {
  // console.log("cobats: ", combats);
  let combat = combats.filter(
    (x) => x.player1 == message.author.id || x.player2 == message.author.id
  );
  // console.log("combat: ", combat);
  // console.log("combat2: ", combat2);
  if (combat.length != 0) {
    if (combat[0].player1 == message.author.id) {
      return await message.channel.send(
        `${message.author.toString()} you are currently in combat with <@!${
          combat[0].player2
        }>`
      );
    } else {
      return await message.channel.send(
        `${message.author.toString()} you are currently in combat with <@!${
          combat[0].player1
        }>`
      );
    }
  } else {
    await message.channel.send(
      "You are not in combat currently. go pick a fight."
    );
  }
};

const dic = {
  duel: startcombat,
  getcombat,
  hunt,
};

module.exports = dic;
