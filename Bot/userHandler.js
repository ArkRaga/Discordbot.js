const users = []
const { startclass } = require('./Rpg/rpgClasses')
let classes = require('./Rpg/rpgClasses')
/// username, discordId, Class, battlepoints,

const handleUsers = (e) => {
  let user = users.filter((x) => x.discordid == e.id)
  // console.log("USer: ", user);
  if (user.length <= 0) {
    users.push({
      discordid: e.id,
      username: e.username,
      battlepoints: 0,
      class: classes.startclass,
    })
  }
}

const createUser = (e) => {
  return { id: e.id, name: e.username, points: 50 }
}

const printusers = () => {
  console.log('Users', users)
}

const pickclass = async (args, message) => {
  let id = message.author.id
  let user = users.filter((x) => x.discordid == id)
  if (user[0].class.name != classes.startclass.name) {
    return await message.channel.send(
      `You already have a class, you are a **${user[0].class.name}**, please use the **!changeclass** command to change your class`,
    )
  }
  let picked = classes[args[0].toLowerCase()]

  if (!picked) {
    return await message.channel.send(
      'Please pick a valid class from the class list. you can view it with **!printclasses**',
    )
  }
  user[0].class = picked

  await message.channel.send(`your class is now a : **${picked.name}**`)
}

const classdetails = async (args, message) => {
  let em = require('./embeds').classEmbed
  let id = message.author.id
  if (args.length > 0) {
    let userclass = classes[args[0].toLowerCase()]
    if (!userclass) {
      return await message.channel.send('Sorry you didnt enter a vaild class')
    }

    em.setTitle(`${userclass.name}`)
    em.attachFiles(`./gfxs/${userclass.gfx.main}`)
    em.setThumbnail(`attachment://${userclass.gfx.main}`)
    em.fields[0].value = userclass.str
    em.fields[1].value = userclass.def
    em.fields[2].value = userclass.speed
    await message.channel.send(em)
    em.files = []
  } else {
    let userclass = getUserCLass(id)
    if (userclass.name == classes.startclass.name) {
      return await message.channel.send(
        'Sorry you have not picked a class yet. use **!pickclass classname** to select a class, or **!classdetails classname** to get information on a class.',
      )
    }
    em.setTitle(`${userclass.name}`)
    em.attachFiles(`./gfxs/${userclass.gfx.main}`)
    em.setThumbnail(`attachment://${userclass.gfx.main}`)
    em.title = userclass.name
    em.fields[0].value = userclass.str
    em.fields[1].value = userclass.def
    em.fields[2].value = userclass.speed
    await message.channel.send(em)
    em.files = []
  }
}

const getUserCLass = (id) => {
  let user = users.filter((x) => x.discordid == id)
  let userclass = classes[user[0].class.name.toLowerCase()]
  if (userclass) {
    return userclass
  } else {
    return 'No class'
  }
}

const changeclass = async (args, message) => {
  let id = message.author.id
  let user = users.filter((x) => x.discordid == id)
  let arr = ['✅', '❌']
  let em = require('./embeds').combatEmbed
  em.title = 'Change your class?'
  em.description =
    'Are you sure? if you do this your battlepoints will be reset along with your level, chose ✅ to continue or ❌ to stop now.'
  const msg = await message.channel.send({
    embed: em,
  })
  await arr.forEach((x) => msg.react(x))

  const filter = (reaction, user) => {
    // console.log("turn: ", combat[target + "name"]);
    return arr.includes(reaction.emoji.name) && user.id == id
  }

  msg
    .awaitReactions(filter, { max: 1 })
    .then((collected) => {
      const reaction = collected.first()
      if (reaction.emoji.name === '✅') {
        user[0].class = classes.startclass
        user[0].battlepoints = 0
        message.reply(
          "You have been reset. use **!pickclass 'className'** to chose a new class. whats done cannot be undone.",
        )
      } else {
        message.reply('No changes were made.')
      }
    })
    .catch((collected) => {
      message.reply('there has been an err')
    })
}

const printme = async (args, message) => {
  let id = message.author.id
  let em = require('./embeds').user2Embed
  let user = users.filter((x) => x.discordid == id)
  em.thumbnail.url = message.author.avatarURL()
  em.author.name = message.author.username
  em.fields[0].value = user[0].class.name
  em.fields[1].value = user[0].battlepoints
  const msg = await message.channel.send({ embed: em })
}

const dic = {
  printusers,
  printme,
  pickclass,
  classdetails,
  changeclass,
}

exports.users = users
exports.handleUsers = handleUsers
exports.dic = dic
