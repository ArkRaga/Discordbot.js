const Discord = require("discord.js");
const client = new Discord.Client();
require("dotenv").config();

const prefix = "!";

const commandHandler = require("./generalCommands").commandHandler;
const handleUsers = require("./userHandler").handleUsers;

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  handleUsers(message.author);
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  message.channel.send(commandHandler(command, args));
});

client.login(process.env.OAUTH);
