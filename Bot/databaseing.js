const axios = require("axios");
const { userhandler, User } = require("./userHandler");
const { itemDictionary } = require("./Rpg/items");
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
const getAllUsers = () => {
  //   console.log("L-6 users1", userhandler.users);
  return axios
    .get(baseUrl)
    .then((users) => {
      // console.log("L37-databaseing users.data: ", users.data);
      return users.data;
    })
    .catch((err) => {
      console.log("there has been an err Databaseing-L12");
      console.log("err: ", err);
    });
};

const getUsersInv = async (id) => {
  // get the data
  //loop thur data create items from each ele
  // create inv and add item to inv
  // if (inventorys.hasInventory(id)) {
  //   console.log("no inventory");
  // } else {
  //   console.log("has");
  // }
  return axios
    .get(baseUrl + `/inv/user/${id}`)
    .then((items) => {
      return items.data;
    })
    .catch((err) => {
      console.log(err);
      console.log("There has been an error geting the users inventory");
    });
};

const addUserItemToDatabase = (id, item) => {
  const ele = { item_id: item.id, item_quantity: item.quantity };
  axios
    .post(baseUrl + `/inv/add/${id}`, ele)
    .then((body) => {
      console.log("posted: ", ele);
    })
    .catch((err) => {
      console.log("there has been an issue adding an item to the database");
    });
};

const updateItemInDatabase = (item) => {
  axios
    .put(baseUrl + "/inv/item", item)
    .then()
    .catch((err) => console.log("Err updateing item"));
};

const getAllInv = () => {
  return axios
    .get(baseUrl + "/inv/all")
    .then((inv) => {
      return inv.data;
    })
    .catch((err) => console.log("err getting all invs"));
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
  addUserItemToDatabase,
  getUsersInv,
  getAllInv,
  getAllUsers,
  updateItemInDatabase,
};

module.exports = dic;
