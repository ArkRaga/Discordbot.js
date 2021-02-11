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

const rpgCombatEndEmbed = new Discord.MessageEmbed()
  .setColor()
  .setTitle()
  .setDescription();

const rpgComabtEmbed = new Discord.MessageEmbed()
  .setTitle("title")
  .setDescription("des");

const questBoardEmbed = new Discord.MessageEmbed()
  .setTitle("Quest Board")
  .setDescription("Here are the available quest you can take")
  .addFields();

const classEmbed = new Discord.MessageEmbed()
  .setTitle("some Title")
  .setColor("457774")
  .addFields(
    {
      name: " Strength ",
      value: "value",
      inline: false,
    },
    {
      name: " Defense: ",
      value: "value",
      inline: false,
    },
    {
      name: " Speed: ",
      value: "value",
      inline: false,
    }
  );

const basicEmbed = new Discord.MessageEmbed().setTitle();

const combatEmbed = {
  color: 0x0099ff,
  title: "Some title",
  description: "Some description here",
};

const testGifEmbed = new Discord.MessageEmbed()
  .setTitle("Gif Test")
  .setDescription("This is a test brought to you yaayaa")
  .attachFiles("./gfxs/Rick.png")
  .setThumbnail("attachment://Rick.png");

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
  .attachFiles("./gfxs/Rick.png")
  .setThumbnail("attachment://Rick.png")
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

const invEmbed = new Discord.MessageEmbed().addFields(
  {
    name: "Name",
    value: "text",
  },
  {
    name: "Inventory",
    value: "text",
  }
);

const qstEmbed = new Discord.MessageEmbed().addFields(
  {
    name: "Name",
    value: "text",
  },
  {
    name: "Description",
    value: "text",
  },
  {
    name: "Rewards",
    value: "text",
  }
);
const crafteditemEmbed = new Discord.MessageEmbed().addFields(
  {
    name: "Name",
    value: "🗡️ to attack or 🛡️ to defend",
    inline: true,
  },
  {
    name: "Type",
    value: "undefined",
    inline: false,
  },
  {
    name: "Required Materials",
    value: "undefined",
    inline: false,
  },
  {
    name: "Dropped by:",
    value: "text",
    inline: false,
  }
);

const itemEmbed = new Discord.MessageEmbed().addFields(
  {
    name: "Name",
    value: "🗡️ to attack or 🛡️ to defend",
    inline: true,
  },
  {
    name: "Type",
    value: "undefined",
    inline: false,
  },
  {
    name: "Dropped by:",
    value: "text",
    inline: false,
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

const dic = {
  exampleEmbed,
  userEmbed,
  classEmbed,
  user2Embed,
  combatEmbed,
  combat2Embed,
  testGifEmbed,
  combatGifTest,
  itemEmbed,
  invEmbed,
  qstEmbed,
  questBoardEmbed,
  rpgComabtEmbed,
  rpgCombatEndEmbed,
  basicEmbed,
  crafteditemEmbed,
};

module.exports = dic;
