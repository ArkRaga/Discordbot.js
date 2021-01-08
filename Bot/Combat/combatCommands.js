const combatState = ["player1Turn", "player2Turn", "endGame", "waiting"];
let combats = [];

const startcombat = async (args, message) => {
  /// checkto see if player is in combat
  combats.push({
    player1: message.author.id,
    player1name: message.author.username,
    player1hp: 10,
    player2: args[0],
    player2hp: 10,
    state: combatState[3],
  });
  await message.channel.send(
    `${
      args[0]
    }! ${message.author.toString()} has challenged thee to fistycuffs, respond with **!accept** to fight or **!deny** to live another day!`
  );
};

const printcombats = async (args, message) => {
  console.log("combats: ", combats);
  await message.channel.send("it has be done M'lord");
};

const accept = async (args, message) => {
  const combat = combats.filter(
    (x) => x.player2.slice(3, -1) == message.author.id
  );
  combat[0].player2 = message.author.id;
  combat[0].state = combatState[0];
  console.log(combat);
  await message.channel.send("you accepted!");
};

const changeState = (combat) => {
  switch (combat.state) {
    case "player1Turn":
      if (combat.player2hp > 0) {
        combat.state = combatState[1];
        //send msg to player 2 todo action
      }
      break;
    case "player2Turn":
      ///do palyer 2 shit
      break;
    default:
      break;
  }
};

///defend fucntion

/// quit combat function

const attack = async (args, message) => {
  let id = message.author.id;
  let combat = combats.filter((x) => x.player1 == id || x.player2 == id);
  // id : 5
  // player1 :5  player2:  7
  if (combat[0].player1 == id) {
    if (combat[0].state === combatState[0]) {
      //take from player2's health
      //set combat state player2's turn
    } else {
      await message.channel.send(
        `It is not currently your turn ${message.author.toString()}`
      );
    }
  } else {
    if (combat[0].state === combatState[1]) {
      //take form player 1's health
      //set combat state  to player 1s turn
    } else {
      await message.channel.send(
        `It is not currently your turn ${message.author.toString()}`
      );
    }
  }
};

const deny = async (args, message) => {
  for (let i of combats) {
    if (i.player2.slice(3, -1) == message.author.id) {
      console.log("Combat to remove: ", i);
      combats = combats.filter(
        (x) => x.player2.slice(3, -1) != message.author.id
      );
      return await message.channel.send("you have denied the right of combat");
    }
  }
  await message.channel.send("no challengers for you yet young one.");
};

const commands = {
  startcombat,
  printcombats,
  accept,
  deny,
};
module.exports = commands;
