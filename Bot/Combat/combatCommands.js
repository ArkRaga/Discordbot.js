const combatState = [
  "player1Turn",
  "player2Turn",
  "endGame",
  "waiting",
  "pTurnWait",
];

let combats = [];

const startcombat = async (args, message) => {
  /// checkto see if player is in combat
  // console.log("beep", args[0]);
  let id = message.author.id;
  if (combats.length > 0) {
    let combat = combats.filter((x) => x.player1 == id || x.player2 == id);
    if (combat.length > 0) {
      return await message.channel.send("your currently in combat");
    }
  }
  combats.push({
    player1: id,
    player1name: message.author.username,
    player1hp: 10,
    player2: args[0],
    player2name: message.guild.members.cache.get(args[0].slice(3, -1)).user
      .username,
    player2hp: 10,
    state: combatState[3],
  });

  if (args[0].slice(3, -1) == "792163801072009236") {
    await message.channel.send(
      "You dare challenge me?! I Accept your foolish request!"
    );
    botAccept(message);
  }

  let em = require("../embeds").combatEmbed;
  let arr = ["🗡️", "🏃"];
  em.title = "A fight Has been issued!";
  // args.map((x) => (em.title += ` ${x}`));
  em.description = `${
    args[0]
  }! ${message.author.toString()} has challenged thee to fistycuffs, respond with 🗡️ to fight or 🏃 to live another day!`;
  const msg = await message.channel.send({ embed: em });
  await arr.forEach((x) => msg.react(x));

  const filter = (reaction, user) => {
    return arr.includes(reaction.emoji.name) && user.id == args[0].slice(3, -1);
  };
  msg
    .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
    .then((collected) => {
      const reaction = collected.first();

      if (reaction.emoji.name === "🗡️") {
        accept(args, message, args[0].slice(3, -1));
      } else {
        message.reply("They have Denied");
      }
    })
    .catch((collected) => {
      message.reply("Time has run out");
    });
};

const botAccept = async (message) => {
  const combat = combats.filter((x) => x.player1 == message.author.id);
  combat[0].state = combatState[0];
  await message.channel.send("Have the first go, Attack me when ready.");
};

const printcombats = async (args, message) => {
  console.log("combats: ", combats);
  await message.channel.send("it has be done M'lord");
};

const accept = async (args, message, p2id) => {
  const combat = combats.filter((x) => x.player2.slice(3, -1) == p2id);
  if (combat.length <= 0) {
    return;
  }
  if (combat[0].state === combatState[3]) {
    combat[0].player2 = p2id;
    combat[0].state = combatState[0];
    // console.log(combat);

    let em = require("../embeds").combatEmbed;
    let arr = ["🗡️", "🛡️"];
    em.title = "The Battle has been accepted!";
    em.description = `<@!${combat[0].player1}> its your turn. **🗡️** to attack or 🛡️ to Defend`;
    const msg = await message.channel.send({ embed: em });
    await arr.forEach((x) => msg.react(x));

    const filter = (reaction, user) => {
      return arr.includes(reaction.emoji.name) && user.id == combat[0].player1;
    };
    msg
      .awaitReactions(filter, { max: 1 })
      .then((collected) => {
        const reaction = collected.first();

        if (reaction.emoji.name === "🗡️") {
          message.reply("You attacked!");
        } else {
          message.reply("You Defended");
        }
      })
      .catch((collected) => {
        message.reply("Time has run out");
      });
  }
};

const doCombat = async (id, combat, message, dmg) => {
  if (combat.player1 == id) {
    if (combat.state === combatState[0]) {
      combat.state = combatState[4];
      console.log("p1 turn");
      combat.player2hp -= dmg;
      console.log("p2 took dmg");
      // console.log("Current Combat: ", combat);
      await message.channel.send(
        `<@!${combat.player1}> has delt **${dmg}** dmg!`
      );
      await message.channel.send(
        `<@!${combat.player2}> has **${combat.player2hp}** :Hp`
      );
      if (combat.player2hp <= 0) {
        console.log("p2 died");
        combat.state = combatState[2];
        await message.channel.send(
          `<@!${combat.player2}> you died, on this day of days.`
        );
      } else {
        console.log("change turn");
        combat.state = combatState[1];
        await message.channel.send(
          `<@!${combat.player2}> your turn to **!attack** or **!defend**`
        );
      }
    } else {
      await message.channel.send(
        `It is not currently your turn <@!${combat.player1}>`
      );
    }
  } else {
    if (combat.state === combatState[1]) {
      combat.state = combatState[4];
      console.log("p2 turn");
      combat.player1hp -= dmg;
      console.log("p1 took dmg");
      await message.channel.send(
        `<@!${combat.player2}> has delt **${dmg}** dmg!`
      );
      await message.channel.send(
        `<@!${combat.player1}> has **${combat.player1hp}** :Hp`
      );
      if (combat.player1hp <= 0) {
        console.log("p1 died");
        combat.state = combatState[2];
        await message.channel.send(
          `<@!${combat.player1}> you died, on this day of days.`
        );
      } else {
        console.log("change turn");
        combat.state = combatState[0];
        await message.channel.send(
          `<@!${combat.player1}> your turn to **!attack** or **!defend**`
        );
      }
    } else {
      await message.channel.send(
        `It is not currently your turn ${message.author.toString()}`
      );
    }
  }
};

///defend fucntion

/// quit combat function

const attack = async (args, message) => {
  let id = message.author.id;
  let Combat = combats.filter((x) => x.player1 == id || x.player2 == id);
  const combat = Combat[0];
  let dmg = Math.floor(Math.random() * 10 + 0);
  // id : 5
  // player1 :5  player2:  7
  if (combat.state == combatState[3]) {
    return await message.channel.send(
      "Wait until your foe has accepted your challenge"
    );
  } else {
    doCombat(id, combat, message, dmg);
  }
};

const deny = async (args, message) => {
  for (let i of combats) {
    if (i.player2.slice(3, -1) == message.author.id) {
      console.log("Combat to remove: ", i);
      combats = combats.filter(
        (x) => x.player2.slice(3, -1) != message.author.id
      );
      return await message.channel.send("you have denied the right of combat");
    }
  }
  await message.channel.send("no challengers for you yet young one.");
};

const commands = {
  startcombat,
  printcombats,
  accept,
  deny,
  attack,
};
module.exports = commands;
