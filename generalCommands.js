const pong = (args) => {
  return `get fucked @${args[0]}`;
};

const punch = (args) => {
  return `outright punches ${args[0]}, that wasnt very nice!`;
};

const hug = (args) => {
  return `Gives a big hug to @${args[0]}`;
};

const printUsers = (args) => {
  const printusers = require("./userHandler").printUsers;
  printusers();
  return "you got it boss";
};

const dic = {
  ping: pong,
  punch: punch,
  hug: hug,
  printusers: printUsers,
};

const commandHandler = (command, args) => {
  for (i in dic) {
    if (command === i) {
      return dic[i](args);
    }
  }
};

exports.commandHandler = commandHandler;
