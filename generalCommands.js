// const Discord = require("discord.js");

// const { Message } = require("discord.js");

const pong = async (args, message) => {
  await message.channel.send(`get fucked @${args[0]}`);
};

const punch = async (args, message) => {
  await message.channel.send(
    `outright punches ${args[0]}, that wasnt very nice!`
  );
};

const hug = async (args, message) => {
  await message.channel.send(`Gives a big hug to @${args[0]}`);
};

const printUsers = async (message) => {
  const printusers = require("./userHandler").printUsers;
  printusers();
  await message.channel.send("you got it boss");
};

const edittopic = async (args, message) => {
  let s = "";
  args.map((x) => (s += `${x} `));
  await message.channel.edit({ topic: s });
  await message.channel.send("It has been done");
};

const embed = async (args, message) => {
  let em = exampleEmbed;
  let arr = ["0️⃣", "2️⃣", "1️⃣"];
  em.title = "";
  args.map((x) => (em.title += ` ${x}`));
  em.description = "go fuck";
  const msg = await message.channel.send({ embed: em });
  await arr.forEach((x) => msg.react(x));
};

const playchess = async (args, message) => {
  await message.channel.send(
    `${args[0]}, ${message.author.username} has challenged you to a game of Chess!`
  );
};

const dic = {
  ping: pong,
  punch: punch,
  hug: hug,
  printusers: printUsers,
  embed: embed,
  playchess: playchess,
  edittopic: edittopic,
};

const commandHandler = async (command, args, message) => {
  for (i in dic) {
    if (command === i) {
      return await dic[i](args, message);
    }
  }
  await message.channel.send("Not a valid Command please try again");
};

exports.commandHandler = commandHandler;

const exampleEmbed = {
  color: 0x0099ff,
  title: "Some title",
  description: "Some description here",
  fields: [
    {
      name: "Regular field title",
      value: "Some value here",
    },
    {
      name: "\u200b",
      value: "\u200b",
      inline: false,
    },
    {
      name: "Inline field title",
      value: "Some value here",
      inline: true,
    },
    {
      name: "Inline field title",
      value: "Some value here",
      inline: true,
    },
    {
      name: "Inline field title",
      value: "Some value here",
      inline: true,
    },
  ],
};
