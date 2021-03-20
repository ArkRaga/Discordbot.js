const axios = require("axios");
const { userhandler, User } = require("./userHandler");
const { itemDictionary } = require("./Rpg/items");
const bclass = require("./Rpg/rpgClasses");
const baseUrl = "http://localhost:3000/api";

const getAllMonstersFromDatabase = () => {
  return axios
    .get(baseUrl + "/monsters/all")
    .then((ele) => {
      return ele.data;
    })
    .catch((err) => {
      consol.log("ther has been an err geting monsters from db");
    });
};

const getAllCharskillsFromDatabase = () => {
  return axios
    .get(baseUrl + "/charskills/all")
    .then((ele) => {
      return ele.data;
    })
    .catch((err) => {
      console.log("Err getting all charskills");
    });
};

const getAllDropsFromDatabase = () => {
  return axios(baseUrl + "/drops/all")
    .then((ele) => {
      return ele.data;
    })
    .catch((err) => {
      console.log("err getting all drops from database");
    });
};

const getUserFromDatabase = () => {
  //   console.log("L-6 users1", userhandler.users);
  axios
    .get(baseUrl + "/users/all")
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
      console.log("err getting users from database Databaseing-L28");
      // console.log("err: ", err);
    });
};
const getAllUsers = () => {
  //   console.log("L-6 users1", userhandler.users);
  return axios
    .get(baseUrl + "/users/all")
    .then((users) => {
      // console.log("L37-databaseing users.data: ", users.data);
      return users.data;
    })
    .catch((err) => {
      console.log("err getting all users Databaseing-L41");
      // console.log("err: ", err);
    });
};
const getUsersInv = async (id) => {
  return await axios
    .get(baseUrl + `/inv/user/${id}`)
    .then((items) => {
      return items.data;
    })
    .catch((err) => {
      console.log(err);
      console.log("There has been an error geting the users inventory");
    });
};
const addUserItemToDatabase = async (id, item) => {
  // return console.log("L57-databeaseing item: ", item);
  const ele = { player_id: id, item_id: item.id, item_quantity: item.quantity };
  await axios
    .post(baseUrl + `/inv/add/${id}`, ele)
    .then((body) => {
      console.log("posted: ", ele);
    })
    .catch((err) => {
      console.log("there has been an issue adding an item to the database");
    });
};
const updateItemInDatabase = async (id, item) => {
  const ele = {
    player_id: id,
    item_id: item.item_id,
    item_quantity: item.item_quantity,
  };
  await axios
    .put(baseUrl + "/inv/item", ele)
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
const getAllItems = () => {
  return axios
    .get(baseUrl + `/items/all`)
    .then((items) => {
      return items.data;
    })
    .catch((err) => {
      console.log("err getting items");
    });
};
const StartUp = async () => {
  //get the users from the database
  //add them as users to the userhandler arr for the bot
  //format the data properly
  await getUserFromDatabase();
  console.log("databaseing L99-done");
};

const dic = {
  getUserFromDatabase,
  StartUp,
  addUserItemToDatabase,
  getUsersInv,
  getAllInv,
  getAllUsers,
  updateItemInDatabase,
  getAllItems,
  getAllMonstersFromDatabase,
  getAllCharskillsFromDatabase,
  getAllDropsFromDatabase,
};
module.exports = dic;
