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
      player2: args[0].slice(3, -1),
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




  const accept = async (args, message, p2id) => {
    const combat = combats.filter((x) => x.player2 == p2id);
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
  };




  const docombat = (player, combat) =>{



    let em = require("../embeds").combatEmbed;
      let arr = ["🗡️", "🛡️"];
      em.title = "The Battle has been accepted!";
      em.description = `<@!${combat.player}> its your turn. **🗡️** to attack or 🛡️ to Defend`;
      const msg = await message.channel.send({ embed: em });
      await arr.forEach((x) => msg.react(x));
  
      const filter = (reaction, user) => {
        return arr.includes(reaction.emoji.name) && user.id == combat.player;
      };
      msg
        .awaitReactions(filter, { max: 1 })
        .then((collected) => {
          const reaction = collected.first();
  
          if (reaction.emoji.name === "🗡️") {
            message.reply("You attacked!");
            //do dmg
            //do health check
            //change state
          } else {
            message.reply("You Defended");
          }
        })
        .catch((collected) => {
          message.reply("Time has run out");
        });



  }