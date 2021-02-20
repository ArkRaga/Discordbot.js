const users = require("./userHandler").users;
const Discord = require("discord.js");

const ping = async (args, message) => {
  await message.channel.send(`${message.author.toString()}, dont bother me`);
};

const punch = async (args, message) => {
  await message.channel.send(
    `outright punches ${args[0]}, that was not very nice!`
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

const printclasses = async (args, message) => {
  // console.log("msg: ", message);
  let rpgClasses = require("./Rpg/rpgClasses");
  let c = "";
  for (i in rpgClasses) {
    c += `${rpgClasses[i]},  `;
  }
  await message.channel.send(c);
};

const printuser = async (args, message) => {
  // console.log("AID: ", users);
  let user = users.filter((x) => x.discordid == message.author.id);
  if (user) {
    let em = require("./embeds").userEmbed;
    console.log("em: ", user);
    em.fields[0].value = user[0].username;
    em.fields[1].value = user[0].class.name;
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
  let emn = require("./embeds");
  let em = emn.combatGifTest;
  let c = users.filter((x) => x.discordid == message.author.id);
  console.log("C: ", c);
  em.attachFiles(`./gfxs/${c[0].class.gfx.main}`).setThumbnail(
    `attachment://${c[0].class.gfx.main}`
  );
  em.fields[0].name = "Shanynays";
  let arr = ["🗡️", "🛡️"];
  const msg = await message.channel.send(em);
  await arr.forEach((x) => msg.react(x));
  const filter = (reaction, user) => {
    return arr.includes(reaction.emoji.name) && user.id == message.author.id;
  };
  msg
    .awaitReactions(filter, { max: 1 })
    .then((collected) => {
      const reaction = collected.first();

      if (reaction.emoji.name === "🗡️") {
        message.reply("awesome");
      } else {
        message.reply("less awesome");
      }
    })
    .catch((collected) => {
      message.reply("there has been an err in create embed");
    });
};

const playchess = async (args, message) => {
  await message.channel.send(
    `${args[0]}, ${message.author.username} has challenged you to a game of Chess!`
  );
};

const say = async (args, message) => {
  const em2 = new Discord.MessageEmbed()
    .setColor()
    .setTitle("Im the seccond embed")
    .setDescription("Do the roar");
  const em1 = new Discord.MessageEmbed()
    .setColor()
    .setTitle("Main embed")
    .setDescription(`${em2.title}, ${em2.description}`);

  return await message.channel.send(em1);
};

const closeRoyal = (args, message) => {
  message.channel.send("The sign up is closed!");
};

const timer = (args, message) => {
  message.channel.send("Spots are open type !join to join");
  setTimeout(closeRoyal, 1500, args, message);
};

const dick = {
  ping,
  punch,
  hug,
  printusers,
  embed,
  playchess,
  edittopic,
  printuser,
  printclasses,
  timer,
  say,
};

module.exports = dick;
