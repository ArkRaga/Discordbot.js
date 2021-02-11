const genCommands = require("./generalCommands");
// const combatCommands = require("./Combat/combatCommands");
const combatReactionCommands = require("./Combat/combatReactHandler");
const userCommands = require("./userHandler").dic;
const inventoryCommands = require("./Rpg/inventory").dic;
const questSystemHandler = require("./Rpg/questHandler");
const { rpgcombat } = require("./Combat/rpgCombat");
const { dungeonCommands } = require("./Rpg/Dungeons/dungeonHandler");

const commands = {
  ...genCommands,
  ...combatReactionCommands,
  ...userCommands,
  ...inventoryCommands,
  ...questSystemHandler,
  ...rpgcombat,
  ...dungeonCommands,
};

const commandHandler = async (command, args, message) => {
  const doesExists = commands[command];

  if (doesExists) {
    await doesExists(args, message);
  } else {
    await message.channel.send("Not a valid Command please try again");
  }
};
module.exports = commandHandler;
