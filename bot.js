const Discord = require("discord.js");
const client = new Discord.Client();
require("dotenv").config();

const prefix = "!";

const commandHandler = require("./Bot/commandHandler");
const handleUsers = require("./Bot/userHandler").handleUsers;

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  handleUsers(message.author);
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  // console.log(message.author.username);
  commandHandler(command, args, message);
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) {
    return;
  }
  console.log(`Reac: ${reaction.count}. User: ${user.username}`);
});

client.login(process.env.OAUTH);
