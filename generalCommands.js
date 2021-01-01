// const Discord = require("discord.js");

const pong = (args) => {
  return `get fucked @${args[0]}`;
};

const punch = (args) => {
  return `outright punches ${args[0]}, that wasnt very nice!`;
};

const hug = (args) => {
  return `Gives a big hug to @${args[0]}`;
};

const printUsers = () => {
  const printusers = require("./userHandler").printUsers;
  printusers();
  return "you got it boss";
};

const embed = (args) => {
  let em = exampleEmbed;
  em.title = "";
  args.map((x) => (em.title += ` ${x}`));
  em.description = "go fuck";
  return { embed: em };
};

const dic = {
  ping: pong,
  punch: punch,
  hug: hug,
  printusers: printUsers,
  embed: embed,
};

const commandHandler = (command, args) => {
  for (i in dic) {
    if (command === i) {
      return dic[i](args);
    }
  }
  return "Not a valid Command please try again";
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
