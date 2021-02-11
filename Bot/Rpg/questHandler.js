// questLog = [];
const { quests } = require("./quests");

/*
 questlog: {
    discordid: id,
    name: username,
    quests: []
}
quest:{
    name: of quest,
    description: what todo,
    reward: []
}
*/

class QuestLogHandler {
  constructor() {
    this.questlogs = [];
  }
  addQuestlog(id, name) {
    //check if exsits
    if (!this.hasQuestlog(id)) {
      this.questlogs.push(new Questlog({ id, name }));
      return;
    }
    return false;
  }
  getQuestlog(id) {
    return this.questlogs.find((x) => x.id == id);
  }
  hasQuestlog(id) {
    return this.questlogs.some((x) => x.id == id);
  }
}

class Questlog {
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
    this.quests = [];
  }
  addQuest(quest) {
    if (!this.hasQuest(quest)) {
      this.quests.push(quest);
      return;
    }
    return false;
  }
  hasQuest(quest) {
    return this.quests.some((x) => x.id === quest.id);
  }
  delQuest(quest) {
    const q = this.quests.filter((x) => x.id !== quest.id);
  }
}

const questlogs = new QuestLogHandler();

const printallqstlogs = (args, message) => {
  console.log("Quest logs: ", queslogs.queslogs);
  message.channel.send("Printed all Quest logs Sir.");
};

const createqstlog = (args, message) => {
  if (questlogs.hasQuestlog(message.author.id)) {
    message.channel.send("Quest log already exists.");
  } else {
    questlogs.addQuestlog(message.author.id, message.author.username);
    message.channel.send("Quest log has been created.");
  }
};

const myqstlog = (args, message) => {
  let log = questlogs.getQuestlog(message.author.id);
  if (log) {
    let emn = require("../embeds");
    let em = Object.create(emn.invEmbed);
    em.files = [];
    em.attachFiles("./gfxs/Questlogicon.png");
    em.setThumbnail("attachment://Questlogicon.png");
    let msg = "";
    em.fields[0].value = `<@!${message.author.id}>`;
    log.quests.forEach((x, i) => (msg += `${i + 1} : ${x.name} \n`));
    em.fields[1].name = "Quest Log";
    em.fields[1].value = msg || "You have no quests!";
    // console.log("LOG: ", log);
    message.channel.send(em);
  } else {
    message.channel.send("Sorry no log was found");
  }
};

const printqst = (args, message) => {
  let qst = getQst(args[0]);
  if (qst) {
    message.channel.send("Qst has been found");
  } else {
    message.channel.send("Qst has not been found");
  }
};

const quest = (args, message) => {
  let qst = getQst(args[0]);
  if (qst.length < 0) {
    return message.channel.send("Quest not found");
  }
  let emn = require("../embeds");
  let em = emn.qstEmbed;
  em.files = [];
  em.attachFiles("./gfxs/Questicon.png");
  em.setThumbnail("attachment://Questicon.png");
  em.fields[0].value = qst.name;
  em.fields[1].value = qst.desc;
  em.fields[2].value = qst.rewards[0].name;
  message.channel.send(em);
};

const giveqst = (args, message) => {
  let qst = getQst(args[0]);
  if (!qst) {
    return message.channel.send("Not valid quest");
  }
  if (!questlogs.hasQuestlog(message.author.id)) {
    questlogs.addQuestlog(message.author.id, message.author.username);
  }
  questlogs.getQuestlog(message.author.id).addQuest(qst);
  message.channel.send(`Added ${qst.name} to your quest log sir.`);
};

const turnin = (args, message) => {
  const qstlog = questlogs.getQuestlog(message.author.id);

  const { inventorys } = require("./inventory");
  const inv = inventorys.getInventory(message.author.id);
  if (!qstlog || qstlog.quests.length <= 0) {
    return message.channel.send("you dont have any quest");
  }
  if (!inv || inv.items <= 0) {
    return message.channel.send("you have no items");
  }
  let qst;
  if (quests.hasOwnProperty(args[0])) {
    qst = new quests[args[0]]();
  } else {
    return message.channel.send("Quest does not exists");
  }
  let canCom = true;

  if (qstlog.hasQuest(qst)) {
    qst.reqs.forEach((x) => {
      if (!inv.hasItem(x)) {
        canCom = false;
        return message.channel.send("You do not have the required Item");
      }
      if (inv.getItem(x).quantity < x.quantity) {
        canCom = false;
        return message.channel.send("You do not have the quantity required");
      }
    });
  } else {
    return message.channel.send("You do not have this quest");
  }
  if (canCom) {
    qst.reqs.forEach((x) => {
      inv.getItem(x).quantity -= x.quantity;
      if (inv.getItem(x).quantity === 0) {
        inv.removeItem(x);
      }
    });
    let msg = "";
    qst.rewards.forEach((x) => {
      msg += ` ${x.name}\n`;
      inv.addItem(x);
    });
    return message.channel.send(
      `You have turned in the quest: ${qst.name} and been given: ${msg} `
    );
  }
};

const qstboard = (args, message) => {
  let emn = require("../embeds");
  let em = emn.questBoardEmbed;
  em.files = [];
  em.attachFiles("./gfxs/QuestBoard.png");
  em.setThumbnail("attachment://QuestBoard.png");
  for (i in quests) {
    const q = new quests[i]();
    em.fields.push({
      name: `${q.name}`,
      value: `${q.desc} \n Reward: ${q.rewards[0].name} x${q.rewards[0].quantity}`,
    });
  }
  em.setFooter("use !acceptqst questname to accept the quest");
  message.channel.send(em);
};

const getQst = (qst) => {
  let qs = quests.hasOwnProperty(qst);
  if (qs) {
    return new quests[qst]();
  } else {
    console.log("No qst found");
    return false;
  }
};

const dic = {
  printallqstlogs,
  createqstlog,
  myqstlog,
  printqst,
  acceptqst: giveqst,
  quest,
  qstboard,
  turnin,
};

module.exports = dic;

// const log = getLogById(message.author.id);
// const qst = getQst(args[0]);
// return !log ? message.channel.send("No quest log") : qst ? log.quest.push(qst) : message.channel.send("Not valid quest");
