let classes = require("./Rpg/rpgClasses");
const axios = require("axios");

const url = "http://localhost:3000/api/";
/// username, discordId, Class, battlepoints,

class userHandler {
  constructor() {
    this.users = [];
  }
  setUsers(arr) {
    this.users = arr;
  }
  addUser(author) {
    if (!this.hasUser(author.id)) {
      this.users.push(
        new User({
          id: author.id,
          name: author.username,
          bclass: new classes.startclass(),
        })
      );
      // add user to the database
      const body = {
        username: author.username,
      };
      axios
        .post(url + `add/${author.id}`, body)
        .then((res) => {
          console.log("Res: ", res.data);
        })
        .catch((err) => {
          console.log("there has been an issue");
        });
    }
  }
  getUser(id) {
    console.log("getUSer id userhandler-L37: ", id);
    return this.users.find((x) => x.id === id);
  }
  hasUser(id) {
    return this.users.some((x) => x.id === id);
  }
}

class User {
  constructor({ id, name, bclass, battlepoints = 5 }) {
    this.id = id;
    this.name = name;
    (this.class = bclass), (this.battlepoints = battlepoints);
  }
  changeClass(bclass) {
    this.class = bclass;
  }
  changeBp(num) {
    this.battlepoints += num;
  }
}
let userhandler = new userHandler();
// console.log("users");
const handleUsers = (author) => {
  userhandler.addUser(author);
};
const printusers = () => {
  console.log("Users", userhandler.users);
};
const pickclass = async (args, message) => {
  let user = userHandler.getUser(message.author.id);
  if (user.class.name != classes.startclass.name) {
    return await message.channel.send(
      `You already have a class, you are a **${user.class.name}**, please use the **!changeclass** command to change your class`
    );
  }
  let picked = classes[args[0].toLowerCase()];

  if (!picked) {
    return await message.channel.send(
      "Please pick a valid class from the class list. you can view it with **!printclasses**"
    );
  }
  user.changeClass(picked);

  await message.channel.send(`your class is now a : **${picked.name}**`);
};
const classdetails = async (args, message) => {
  let em = require("./embeds").classEmbed;
  if (args.length > 0) {
    let userclass = new classes[args[0].toLowerCase()]();
    if (!userclass) {
      return await message.channel.send("Sorry you didnt enter a vaild class");
    }

    em.setTitle(`${userclass.name}`);
    em.attachFiles(`./gfxs/${userclass.gfx.main}`);
    em.setThumbnail(`attachment://${userclass.gfx.main}`);
    em.fields[0].value = userclass.str;
    em.fields[1].value = userclass.def;
    em.fields[2].value = userclass.speed;
    await message.channel.send(em);
    em.files = [];
  } else {
    let userclass = userhandler.getUser(message.author.id).class;
    console.log("PRINT: ", userclass);
    if (userclass.name == classes.startclass.name) {
      return await message.channel.send(
        "Sorry you have not picked a class yet. use **!pickclass classname** to select a class, or **!classdetails classname** to get information on a class."
      );
    }
    em.setTitle(`${userclass.name}`);
    em.attachFiles(`./gfxs/${userclass.gfx.main}`);
    em.setThumbnail(`attachment://${userclass.gfx.main}`);
    em.title = userclass.name;
    em.fields[0].value = userclass.str;
    em.fields[1].value = userclass.def;
    em.fields[2].value = userclass.speed;
    await message.channel.send(em);
    em.files = [];
  }
};
const changeclass = async (args, message) => {
  let id = message.author.id;
  let user = userhandler.getUser(id);
  let arr = ["✅", "❌"];
  let em = require("./embeds").combatEmbed;
  em.title = "Change your class?";
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
        user.class = classes.startclass;
        user.battlepoints = 0;
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
const addme = (args, message) => {
  const body = {
    username: message.author.username,
  };
  axios
    .post(url + `add/${message.author.id}`, body)
    .then((res) => {
      console.log("Res: ", res.data);
    })
    .catch((err) => {
      console.log("there has been an issue");
    });
};

const printme = async (args, message) => {
  let em = require("./embeds").user2Embed;
  // console.log("printme-id: ", message.author);
  let user = userhandler.getUser(message.author.id);
  if (!user) {
    return await message.channel.send("none found");
  }
  em.thumbnail.url = message.author.avatarURL();
  em.author.name = message.author.username;
  em.fields[0].value = user.class.name;
  em.fields[1].value = user.battlepoints;
  const msg = await message.channel.send({ embed: em });
};

const dic = {
  printusers,
  printme,
  pickclass,
  classdetails,
  changeclass,
  addme,
};

exports.users = userhandler.users;
exports.handleUsers = handleUsers;
module.exports.userhandler = userhandler;
module.exports.User = User;
exports.dic = dic;
