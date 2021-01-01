const users = {};

const handleUsers = (e) => {
  let user = users[e.id];
  // console.log(e);
  if (user === undefined) {
    users[e.id] = { id: e.id, username: e.username, points: 50 };
  }
};

const createUser = (e) => {
  return { id: e.id, name: e.username, points: 50 };
};

const printUsers = () => {
  console.log("Users", users);
};

exports.handleUsers = handleUsers;
exports.printUsers = printUsers;
