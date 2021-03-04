const axios = require("axios");
const { userhandler, User } = require("./userHandler");
const bclass = require("./Rpg/rpgClasses");
const baseUrl = "http://localhost:3000/api";

const getUserFromDatabase = () => {
  //   console.log("L-6 users1", userhandler.users);
  axios
    .get(baseUrl)
    .then((users) => {
      let usr = users.data;
      let userArr = [];
      usr.forEach((u) => {
        userArr.push(
          new User({
            id: u.discordId,
            name: u.username,
            bclass: new bclass[u.class.toLowerCase()](),
            battlepoints: u.points,
          })
        );
      });
      userhandler.setUsers(userArr);
      //   console.log("L22-users after axios", userhandler.users);
    })
    .catch((err) => {
      console.log("there has been an err Databaseing-L12");
      console.log("err: ", err);
    });
};

const StartUp = async () => {
  //get the users from the database
  //add them as users to the userhandler arr for the bot
  //format the data properly
  await getUserFromDatabase();
  console.log("databaseing L33-done");
};

const dic = {
  getUserFromDatabase,
  StartUp,
};

module.exports = dic;
