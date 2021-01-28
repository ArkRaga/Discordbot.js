questLog = []
const quests = require('./quests')

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

const printallqstlogs = (args, message) => {
  console.log('Quest logs: ', questLog)
  message.channel.send('Printed all Quest logs Sir.')
}

const createqstlog = (args, message) => {
  let userlog = getLogByID(message.author.id)

  if (userlog) {
    console.log('quest log: ', userlog)
    message.channel.send('Quest log already exists.')
  } else {
    let log = {
      discordId: message.author.id,
      name: message.author.username,
      quests: [],
    }
    questLog.push(log)
    console.log('Added quest log: ', log)
    message.channel.send('Quest log has been created.')
  }
}

const printuserqstlog = (args, message) => {
  let log = getLogByID(message.author.id)
  if (log) {
    let emn = require('../embeds')
    let em = emn.invEmbed
    em.files = []
    em.attachFiles('./gfxs/Questlogicon.png')
    em.setThumbnail('attachment://Questlogicon.png')
    let msg = ''
    em.fields[0].value = `<@!${message.author.id}>`
    log.quests.forEach((x, i) => (msg += `${i + 1} : ${x.name} \n`))
    em.fields[1].name = 'Quest Log'
    em.fields[1].value = msg
    // console.log("LOG: ", log);
    message.channel.send(em)
  } else {
    message.channel.send('Sorry no log was found')
  }
}

const printqst = (args, message) => {
  let qst = getQst(args[0])
  if (qst) {
    message.channel.send('Qst has been found')
  } else {
    message.channel.send('Qst has not been found')
  }
}

const quest = (args, message) => {
  let qst = getQst(args[0])
  if (qst.length < 0) {
    return message.channel.send('Quest not found')
  }
  let emn = require('../embeds')
  let em = emn.qstEmbed
  em.files = []
  em.attachFiles('./gfxs/Questicon.png')
  em.setThumbnail('attachment://Questicon.png')
  em.fields[0].value = qst.name
  em.fields[1].value = qst.desc
  em.fields[2].value = qst.rewards[0].name
  message.channel.send(em)
}

const giveqst = (args, message) => {
  let log = getLogByID(message.author.id)
  if (!log) {
    message.channel.send('No quest log')
  } else {
    let qst = getQst(args[0])
    if (!qst) {
      return message.channel.send('Not valid quest')
    }
    if (userhasqst(qst, message.author.id)) {
      return message.channel.send(`User already has qst: ${qst.name}.`)
    }
    log.quests.push(qst)
    console.log('Pushed qst: ', qst)
    message.channel.send(`Added ${qst.name} to your quest log sir.`)
  }
}

const getLogByID = (id) => {
  let log = questLog.filter((x) => x.discordId == id)
  if (log.length > 0) {
    return log[0]
  } else {
    return false
  }
}

const userhasqst = (qst, id) => {
  let log = getLogByID(id)
  let q = log.quests.filter((x) => x.id == qst.id)
  if (q.length > 0) {
    return true
  } else {
    return false
  }
}

const getQst = (qst) => {
  let qs = quests[qst]
  if (qs) {
    console.log('Qst: ', qs)
    return qs
  } else {
    console.log('No qst found')
    return false
  }
}

const dic = {
  printallqstlogs,
  createqstlog,
  printuserqstlog,
  printqst,
  giveqst,
  quest,
}

module.exports = dic

// const log = getLogById(message.author.id);
// const qst = getQst(args[0]);
// return !log ? message.channel.send("No quest log") : qst ? log.quest.push(qst) : message.channel.send("Not valid quest");
