const commands = require("./Combat/combatCommands");
const Discord = require("discord.js");

const userEmbed = {
  color: 457774,
  fields: [
    {
      name: " Username: ",
      value: "",
      inline: false,
    },
    {
      name: " Class: ",
      value: "",
      inline: false,
    },
    {
      name: " BattlePoints: ",
      value: "",
      inline: false,
    },
  ],
};

const classEmbed = {
  title: "Some title",
  color: 457774,
  fields: [
    {
      name: " Strength ",
      value: "",
      inline: false,
    },
    {
      name: " Defense: ",
      value: "",
      inline: false,
    },
    {
      name: " Speed: ",
      value: "",
      inline: false,
    },
  ],
};

const combatEmbed = {
  color: 0x0099ff,
  title: "Some title",
  description: "Some description here",
};

const testGifEmbed = new Discord.MessageEmbed()
  .setTitle("Gif Test")
  .setDescription("This is a test brought to you yaayaa")
  .attachFiles(["./gfxs/test.gif"])
  .setThumbnail("attachment://test.gif");

const user2Embed = {
  thumbnail: {
    url: "https://cdn.discordapp.com/embed/avatars/0.png",
  },
  author: {
    name: "Arkraga",
  },
  fields: [
    {
      name: "Class: ",
      value: "Starter",
    },
    {
      name: "Battle Points: ",
      value: "500",
    },
  ],
};

const combatGifTest = new Discord.MessageEmbed()
  .setTitle("Turn 34")
  .setColor("DD1362")
  .attachFiles(["./gfxs/test.gif"])
  .setThumbnail("attachment://test.gif")
  .addFields(
    {
      name: "**Player1 hp :#** || **player2 hp: #**",
      value: "@one has done dmg to @two",
    },
    {
      name: "@person its your turn",
      value: "🗡️ to attack or 🛡️ to defend",
    }
  );

const combat2Embed = {
  title: "Failed ",
  color: 16187396,
  fields: [
    {
      name: "Failed ",
      value: "Failed",
      inline: false,
    },

    {
      name: "Player2 its your turn",
      value: "**🗡️** to attack or 🛡️ to Defend",
    },
  ],
};

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

exports.exampleEmbed = exampleEmbed;
exports.userEmbed = userEmbed;
exports.classEmbed = classEmbed;
exports.user2Embed = user2Embed;
exports.combatEmbed = combatEmbed;
exports.combat2Embed = combat2Embed;
exports.testGifEmbed = testGifEmbed;
exports.combatGifTest = combatGifTest;
