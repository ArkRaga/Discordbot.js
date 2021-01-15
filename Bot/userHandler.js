const users = [];
const { startclass } = require("./Rpg/rpgClasses");
var classes = require("./Rpg/rpgClasses");
/// username, discordId, Class, battlepoints,

const handleUsers = (e) => {
  let user = users.filter((x) => x.discordid == e.id);
  // console.log("USer: ", user);
  if (user.length <= 0) {
    users.push({
      discordid: e.id,
      username: e.username,
      battlepoints: 0,
      class: classes.startclass.name,
    });
  }
};

const createUser = (e) => {
  return { id: e.id, name: e.username, points: 50 };
};

const printUsers = () => {
  console.log("Users", users);
};

const pickclass = async (args, message) => {
  var id = message.author.id;
  var user = users.filter((x) => x.discordid == id);
  if (user[0].class != "starter") {
    return await message.channel.send(
      `You already have a class, you are a **${user[0].class}**, please use the **!changeclass** command to change your class`
    );
  }
  var picked = classes[args[0].toLowerCase()].name;
  if (!picked) {
    return await message.channel.send(
      "Please pick a valid class from the class list. you can view it with **!printclasses**"
    );
  }
  user[0].class = picked;
  await message.channel.send(`you picked: **${picked}**`);
};

const classdetails = async (args, message) => {
  var em = require("./embeds").classEmbed;
  var id = message.author.id;
  var user = users.filter((x) => x.discordid == id);
  var userclass = classes[user[0].class.toLowerCase()];
  em.title = userclass.name;
  em.fields[0].value = userclass.str;
  em.fields[1].value = userclass.def;
  em.fields[2].value = userclass.speed;
  await message.channel.send({ embed: em });
};

const changeclass = async (args, message) => {
  var id = message.author.id;
  var user = users.filter((x) => x.discordid == id);
  var arr = ["✅", "❌"];
  var em = require("./embeds").combatEmbed;
  em.title = "Change your clas?";
  em.description =
    "Are you sure? if you do this your battlepoints will be reset along with your level, chose ✅ to continue or ❌ to stop now.";
  const msg = await message.channel.send({
    embed: em,
  });
  await arr.forEach((x) => msg.react(x));

  const filter = (reaction, user) => {
    // console.log("turn: ", combat[target + "name"]);
    return arr.includes(reaction.emoji.name) && user.id == id;
  };

  msg
    .awaitReactions(filter, { max: 1 })
    .then((collected) => {
      const reaction = collected.first();
      if (reaction.emoji.name === "✅") {
        user[0].class = classes.startclass.name;
        user[0].battlepoints = 0;
        message.reply(
          "You have been reset. use **!pickclass 'className'** to chose a new class. whats done cannot be undone."
        );
      } else {
        message.reply("No changes were made.");
      }
    })
    .catch((collected) => {
      message.reply("there has been an err");
    });
};

const printme = async (args, message) => {
  var id = message.author.id;
  var em = require("./embeds").user2Embed;
  var user = users.filter((x) => x.discordid == id);
  em.thumbnail.url = message.author.avatarURL();
  em.author.name = message.author.username;
  em.fields[0].value = user[0].class;
  em.fields[1].value = user[0].battlepoints;
  const msg = await message.channel.send({ embed: em });
};

const dic = {
  printUsers,
  printme,
  pickclass,
  classdetails,
  changeclass,
};

exports.users = users;
exports.handleUsers = handleUsers;
exports.dic = dic;
