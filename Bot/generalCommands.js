const users = require("./userHandler").users;

const ping = async (args, message) => {
  await message.channel.send(`get fucked @${message.author.username}`);
};

const punch = async (args, message) => {
  await message.channel.send(
    `outright punches ${args[0]}, that wasnt very nice!`
  );
};

const hug = async (args, message) => {
  await message.channel.send(`Gives a big hug to @${args[0]}`);
};

const printusers = async (args, message) => {
  // console.log("msg: ", message);
  const printusers = require("./userHandler").printUsers;
  printusers();
  await message.channel.send("you got it boss");
};

const printuser = async (args, message) => {
  // console.log("AID: ", users);
  let user = users.filter((x) => x.discordid == message.author.id);
  if (user) {
    let em = require("./embeds").userEmbed;
    console.log("em: ", user);
    em.fields[0].value = user[0].username;
    em.fields[1].value = user[0].class;
    em.fields[2].value = user[0].battlepoints;
    await message.channel.send({ embed: em });
  } else {
    await message.channel.send("you are not found");
  }
};

const edittopic = async (args, message) => {
  let s = "";
  args.map((x) => (s += `${x} `));
  await message.channel.edit({ topic: s });
  await message.channel.send("It has been done");
};

const embed = async (args, message) => {
  let em = require("./embeds").exampleEmbed;
  let arr = ["🗡️", "🛡️", "🏃"];
  em.title = "";
  args.map((x) => (em.title += ` ${x}`));
  em.description = "go fuck";
  const msg = await message.channel.send({ embed: em });
  await arr.forEach((x) => msg.react(x));

  const filter = (reaction, user) => {
    return arr.includes(reaction.emoji.name) && user.id == message.author.id;
  };
  msg
    .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
    .then((collected) => {
      const reaction = collected.first();

      if (reaction.emoji.name === "🗡️") {
        message.reply("yo");
      } else {
        message.reply("ohhh");
      }
    })
    .catch((collected) => {
      message.reply("you reacted with neither a thumbs up, nor a thumbs down.");
    });
};

const playchess = async (args, message) => {
  await message.channel.send(
    `${args[0]}, ${message.author.username} has challenged you to a game of Chess!`
  );
};

const sayhi = async (args, message) => {
  let num = message.author.id;
  // console.log("Here: ", message.guild.members.cache.get(id).user.username);
  await message.channel.send(`<@!${num}>`);
};

const dic = {
  ping,
  punch,
  hug,
  printusers,
  embed,
  playchess,
  edittopic,
  printuser,
  sayhi,
};

module.exports = dic;
