const genCommands = require("./generalCommands");

const commands = {
  ...genCommands,
};

const commandHandler = async (command, args, message) => {
  for (i in commands) {
    if (command === i) {
      // console.log("cmdHDR: ", message.author.username);
      return await commands[i](args, message);
    }
  }
  await message.channel.send("Not a valid Command please try again");
};
module.exports = commandHandler;