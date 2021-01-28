const inventorys = []
const { items, itemDictionary } = require('./items')
const fs = require('fs')
const { ItemTypes } = require('./items')

/*
iventory:
    discordid: person.id
    name: username,
    items:[]
*/

/*
commnads
add,edit,delete
*/

const getinv = (id) => {
  let inv = inventorys.filter((x) => x.discordid == id)
  if (inv.length > 0) {
    // console.log("Get Inv: ", inv[0]);
    return inv[0]
  } else {
    console.log('Inv dosent exists')
    return false
  }
}

const adduserinv = (id, name) => {
  inv = {
    discordid: id,
    name: name,
    items: [],
  }
  inventorys.push(inv)
}

const additem = (inv, item) => {
  let userinv = inv
  let i = getinvitem(userinv, item)
  if (i) {
    i.quantity += 1
  } else {
    if (!item) {
      return console.log('invaild item: ', item)
    }
    userinv.items.push(item)
  }
}

const removeitemfrominv = (id, i) => {
  let inv = getinv(id)
  inv.items = inv.items.filter((x) => x.id != i.id)
}

const getitem = (args) => {
  switch (args[0]) {
    case 'name':
      return itemDictionary[args[1]]
    case 'id':
      for (i in itemDictionary) {
        if (itemDictionary[i].id == args[1]) {
          return itemDictionary[i]
        }
      }
      break
    default:
      return itemDictionary[args[0]]
  }
}

const checkinvitem = (inv, item) => {
  //Check if an inventory has item
  let hasitem = false
  inv.items.forEach((x) => {
    if (x.name == item.name) {
      return (hasitem = true)
    }
  })
  return hasitem
}

const editinvitem = (id, item, key, value) => {
  let inv = getinv(id)
  item = getinvitem(inv, item)
  item[key] = value
}

const getinvitem = (inv, i) => {
  // Get an item in a inventory
  let item = inv.items.filter((x) => x.name == i.name)
  if (item.length > 0) {
    // console.log("GetinvItem found: ", item[0]);
    return item[0]
  } else {
    // console.log("Get Item not found in inv");
    return false
  }
}

const itemEmbed = (item) => {
  let emn = require('../embeds')
  let em = emn.itemEmbed
  em.files = []
  if (fs.existsSync(`./gfxs/${item.name}.png`)) {
    em.attachFiles(`./gfxs/${item.name}.png`)
    em.setThumbnail(`attachment://${item.name}.png`)
  } else {
    em.attachFiles('./gfxs/testItem.png')
    em.setThumbnail('attachment://testItem.png')
  }
  if (item.type == ItemTypes.MATERIAL) {
    em.fields[0].value = item.id
    em.fields[1].value = item.name
    em.fields[2].value = 'Material'
    em.fields[3].name = 'Quality'
    em.fields[3].value = item.quality // Im the number in the enum, you need to implement something to look up quality names :D
  }
  if (item.type == ItemTypes.CRAFTEDITEM) {
    em.fields[0].value = item.id
    em.fields[1].value = item.name
    em.fields[2].value = 'Crafted item'
    em.fields[3].name = 'Required Mats:'
    let m = ''
    item.mats.forEach((x) => (m += ` **${x.name}** x${x.quantity}, \n`))
    em.fields[3].value = m
  }
  return em
}

/*/////
    Commnads
 ////*/
const craft = (args, message) => {
  let item = getitem(args)
  console.log('Craft Item: ', item)
  let inv = getinv(message.author.id)
  console.log('Craft User inv: ', inv)
  let canCraft = true
  if (!item) {
    return message.channel.send('invalid Crafting item')
  }
  // console.log("craft item.mats", Array.isArray(item.mats));
  item.mats.forEach((ele) => {
    if (!checkinvitem(inv, ele)) {
      message.channel.send('you do not have the material required')
      return (canCraft = false)
    }
    if (ele.quantity > getinvitem(inv, ele).quantity) {
      message.channel.send(` you do not have enough of **${ele.name}**`)
      return (canCraft = false)
    }
  })
  if (!canCraft) {
    return
  }
  item.mats.forEach((ele) => {
    if (getinvitem(inv, ele).quantity > ele.quantity) {
      getinvitem(inv, ele).quantity -= ele.quantity
    } else {
      removeitemfrominv(message.author.id, ele)
    }
  })
  inv.items.push(item)
  message.channel.send('suscessfully crafted: ', item.name)
}

const addinv = (args, message) => {
  inv = {
    discordid: message.author.id,
    name: message.author.username,
    items: [],
  }
  inventorys.push(inv)
  message.channel.send('it has be done')
}

const item = (args, message) => {
  switch (args[0]) {
    case 'name': {
      let SelectedItem = itemDictionary[args[1]].itemClass
      message.channel.send(itemEmbed(new SelectedItem()))
      break
    }
    case 'id': {
      for (i in itemDictionary) {
        if (itemDictionary[i].id == args[1]) {
          let SelectedItem = itemDictionary[i].itemClass
          message.channel.send(itemEmbed(new SelectedItem()))
        }
      }
      break
    }
    default: {
      console.log('boom')
      //let SelectedItem = itemDictionary[args[0]].itemClass
      //if (SelectedItem) {
      //  message.channel.send(itemEmbed(new SelectedItem()))
      //} else {
      message.channel.send('no item found please try again')
      //}
      break
    }
  }
}

const edititem = (args, message) => {
  let inv = getinv(message.author.id)
  let i = getitem(args)
  let item = getinvitem(inv, new i.itemClass())
  if (!item) {
    return message.channel.send('You do not have this item')
  }
  if (args.length >= 4) {
    item[args[2]] = args[3]
  } else {
    item[args[1]] = args[2]
  }
  message.channel.send('Item has been edited')
}

const removeinvitem = (args, message) => {
  let item = getitem(args)
  removeitemfrominv(message.author.id, new item.itemClass())
}

const printmyinv = (args, message) => {
  let inv = getinv(message.author.id)
  console.log('your inv: ', inv)
  let emn = require('../embeds')
  let em = emn.invEmbed
  let msg = ''
  inv.items.forEach((x) => (msg += ` ${x.name} x${x.quantity}\n`))
  em.fields[0].value = `<@!${message.author.id}>`
  em.fields[1].value = msg
  message.channel.send(em)
}

const giveitem = (args, message) => {
  let userinv = getinv(message.author.id)
  let item = getitem(args)
  let i = item ? getinvitem(userinv, new item.itemClass()) : false
  if (!item) {
    return message.channel.send('no item was found.')
  }
  if (i) {
    i.quantity += 1
  } else {
    item = new item.itemClass()

    args.forEach((x, i) => {
      if (i != 0) {
        let n = i
        n += 1
        if (n % 2 === 0) {
          item[x] = args[i + 1]
        }
      }
    })
    userinv.items.push(item)
  }
  // console.log("pushed : ", items[args[0]]);
  message.channel.send(`Given item: **${item.name}** `)
}

const printinv = (args, message) => {
  console.log('inv: ', inventorys)
}

const printinvitems = (args, message) => {
  console.log('Item: ', inventorys[0].items)
}

const dic = {
  addinv,
  printinv,
  printinvitems,
  giveitem,
  getinv,
  printmyinv,
  getinvitem,
  item,
  removeitemfrominv,
  removeinvitem,
  editinvitem,
  edititem,
  craft,
  adduserinv,
  additem,
}

module.exports = dic
