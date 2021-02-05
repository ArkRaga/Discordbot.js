// const inventorys = [];
const { items, itemDictionary } = require("./items");
const fs = require("fs");
const { ItemTypes } = require("./items");
const { ItemDictionaryEntry } = require("./items");

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

class userInventory {
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
    this.items = [];
  }
  print() {
    console.log(this);
  }
  addItem(item) {
    if (this.hasItem(item)) {
      const i = this.getItem(item);
      i.quantity += item.quantity;
    } else {
      this.items.push(item);
    }
  }
  hasItem(healingCombatPowerModifier) {
    return this.items.some((x) => x.id === healingCombatPowerModifier.id);
  }
  getItem(healingCombatPowerModifier) {
    const i = this.items.filter((x) => x.id === healingCombatPowerModifier.id);
    return i[0];
  }
  removeItem(healingCombatPowerModifier) {
    return (this.items = this.items.filter(
      (x) => x.id !== healingCombatPowerModifier.id
    ));
  }
}

class usersInventoryHandler {
  constructor() {
    this.inventories = [];
  }
  //add edit delete
  print() {
    console.log(this.inventories);
  }
  printUserInventory(id) {
    let ui = this.getInventory(id);
    ui.print();
  }
  addInventory(id, name) {
    if (!this.hasInventory(id)) {
      const ui = new userInventory({
        id: id,
        name: name,
      });
      this.inventories.push(ui);
    } else {
      return false;
    }
  }
  hasInventory(id) {
    return this.inventories.some((x) => x.id === id);
  }
  getInventory(id) {
    const i = this.inventories.find((x) => x.id === id);
    return i;
  }
  removeInventory(id) {
    this.inventories = this.inventories.filter((x) => x.id !== id);
  }
}

const inventorys = new usersInventoryHandler();

const itemEmbed = (item) => {
  let emn = require("../embeds");
  let em = emn.itemEmbed;
  em.files = [];
  if (fs.existsSync(`./gfxs/${item.name}.png`)) {
    em.attachFiles(`./gfxs/${item.name}.png`);
    em.setThumbnail(`attachment://${item.name}.png`);
  } else {
    em.attachFiles("./gfxs/testItem.png");
    em.setThumbnail("attachment://testItem.png");
  }
  if (item.type == ItemTypes.MATERIAL) {
    em.fields[0].value = item.id;
    em.fields[1].value = item.name;
    em.fields[2].value = "Material";
    em.fields[3].name = "Quality";
    em.fields[3].value = item.quality; // Im the number in the enum, you need to implement something to look up quality names :D
  }
  if (item.type == ItemTypes.CRAFTEDITEM) {
    em.fields[0].value = item.id;
    em.fields[1].value = item.name;
    em.fields[2].value = "Crafted item";
    em.fields[3].name = "Required Mats:";
    let m = "";
    item.mats.forEach((x) => (m += ` **${x.name}** x${x.quantity}, \n`));
    em.fields[3].value = m;
  }
  return em;
};

/*/////
    Commnads
 ////*/
const craft = (args, message) => {
  let i = getitem(args);
  let item = new i.itemClass();
  console.log("Craft Item: ", item);
  let inv = getinv(message.author.id);
  console.log("Craft User inv: ", inv);
  let canCraft = true;
  if (!item) {
    return message.channel.send("invalid Crafting item");
  }
  // console.log("craft item.mats", Array.isArray(item.mats));
  item.mats.forEach((ele) => {
    if (!checkinvitem(inv, ele)) {
      message.channel.send("you do not have the material required");
      return (canCraft = false);
    }
    if (ele.quantity > getinvitem(inv, ele).quantity) {
      message.channel.send(` you do not have enough of **${ele.name}**`);
      return (canCraft = false);
    }
  });
  if (!canCraft) {
    return;
  }
  item.mats.forEach((ele) => {
    if (getinvitem(inv, ele).quantity > ele.quantity) {
      getinvitem(inv, ele).quantity -= ele.quantity;
    } else {
      removeitemfrominv(message.author.id, ele);
    }
  });
  inv.items.push(item);
  message.channel.send("suscessfully crafted: ", item.name);
};

const addinv = (args, message) => {
  inventorys.addInventory(message.author.id, message.author.username);
  message.channel.send("it has be done");
};

const item = (args, message) => {
  switch (args[0]) {
    case "name": {
      let SelectedItem = itemDictionary[args[1]].itemClass;
      message.channel.send(itemEmbed(new SelectedItem()));
      break;
    }
    case "id": {
      for (i in itemDictionary) {
        if (itemDictionary[i].id == args[1]) {
          let SelectedItem = itemDictionary[i].itemClass;
          message.channel.send(itemEmbed(new SelectedItem()));
        }
      }
      break;
    }
    default: {
      let SelectedItem = itemDictionary[args[0]].itemClass;
      if (SelectedItem) {
        message.channel.send(itemEmbed(new SelectedItem()));
      } else {
        message.channel.send("no item found please try again");
      }
      break;
    }
  }
};

const edititem = (args, message) => {
  let inv = inventorys.getInventory(message.author.id);
  let item = new itemDictionary[args[0]].itemClass();
  if (!inv.hasItem(item)) {
    return message.channel.send("You do not have this item");
  }
  if (args.length >= 4) {
    item[args[2]] = args[3];
  } else {
    item[args[1]] = args[2];
  }
  message.channel.send("Item has been edited");
};

const removeinvitem = (args, message) => {
  let item = getitem(args);
  removeitemfrominv(message.author.id, new item.itemClass());
};

const printmyinv = (args, message) => {
  inventorys.printUserInventory(message.author.id);
  const inven = inventorys.getInventory(message.author.id);
  let emn = require("../embeds");
  let em = emn.invEmbed;
  em.attachFiles("./gfxs/Inventoryicon.png");
  em.setThumbnail("attachment://Inventoryicon.png");
  let msg = "";
  inven.items.forEach((x) => (msg += ` ${x.name} x${x.quantity}\n`));
  em.fields[0].value = `<@!${message.author.id}>`;
  em.fields[1].value = msg;
  message.channel.send(em);
};

const giveitem = (args, message) => {
  let userinv = inventorys.getInventory(message.author.id);
  let item = new itemDictionary[args[0]].itemClass();
  if (!userinv.hasItem(item)) {
    userinv.removeItem(item);
  }
  args.forEach((x, i) => {
    if (i != 0) {
      let n = i;
      n += 1;
      if (n % 2 === 0) {
        item[x] = args[i + 1];
      }
    }
  });
  userinv.addItem(item);
  console.log("Given Item: ", item);
  // console.log("pushed : ", items[args[0]]);
  message.channel.send(`Given item: **${item.name}** `);
};

const printinv = (args, message) => {
  console.log("inv: ", inventorys);
};

const printinvitems = (args, message) => {
  console.log("Item: ", inventorys);
};

const dic = {
  addinv,
  printinv,
  printinvitems,
  giveitem,
  printmyinv,
  item,
  removeinvitem,
  edititem,
  craft,
};

module.exports.dic = dic;
module.exports.inventorys = inventorys;
