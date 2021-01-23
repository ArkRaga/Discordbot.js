const genCommands = require("./generalCommands");
// const combatCommands = require("./Combat/combatCommands");
const combatReactionCommands = require("./Combat/combatReactHandler");
const userCommands = require("./userHandler").dic;
const { dic } = require("./userHandler");
const inventoryCommands = require("./Rpg/inventory").dic;

const commands = {
  ...genCommands,
  ...combatReactionCommands,
  ...userCommands,
  ...inventoryCommands,
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
