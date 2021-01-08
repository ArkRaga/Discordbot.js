const users = [];
/// username, discordId, Class, battlepoints,

const handleUsers = (e) => {
  let user = users.filter((x) => x.discordid == e.id);
  // console.log("USer: ", user);
  if (user.length <= 0) {
    users.push({
      discordid: e.id,
      username: e.username,
      battlepoints: 50,
      class: "starter",
    });
  }
};

const createUser = (e) => {
  return { id: e.id, name: e.username, points: 50 };
};

const printUsers = () => {
  console.log("Users", users);
};

exports.users = users;
exports.handleUsers = handleUsers;
exports.printUsers = printUsers;
