// const inventorys = [];
const { items, itemDictionary } = require("./items");
const fs = require("fs");
const { ItemTypes } = require("./items");

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
    if (!ui) {
      return console.log("no inventory");
    }
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
  let em;
  // em.files = [];
  // em.fields = [];

  if (item.type == ItemTypes.MATERIAL) {
    em = Object.create(emn.itemEmbed);
    em.fields[0].value = item.name;
    em.fields[1].value = "Material";
    em.fields[2].value = getDropBy(item);
  }
  if (item.type == ItemTypes.CRAFTEDITEM) {
    em = Object.create(emn.crafteditemEmbed);
    em.fields[0].value = item.name;
    em.fields[1].value = "Crafted item";
    let m = "";
    item.mats.forEach((x) => (m += ` **${x.name}** x${x.quantity}, \n`));
    em.fields[2].value = m;
    em.fields[2].inline = true;
    em.fields[3].value = getDropBy(item);
    em.fields[3].inline = true;
  }
  if (fs.existsSync(`./gfxs/${item.name}.png`)) {
    em.attachFiles(`./gfxs/${item.name}.png`);
    em.setThumbnail(`attachment://${item.name}.png`);
  } else {
    em.attachFiles("./gfxs/testItem.png");
    em.setThumbnail("attachment://testItem.png");
  }
  return em;
};

const getDropBy = (item) => {
  const { monsters } = require("./monsters");
  let hasMe = "";
  for (i in monsters) {
    const t = new monsters[i]();

    t.drops.forEach((x) => {
      if (x.id === item.id) {
        hasMe += ` ${t.name}\n`;
      }
    });
  }
  if (hasMe === "") {
    hasMe = "nothing";
  }
  return hasMe;
};

/*/////
    Commnads
 ////*/
const craft = async (args, message) => {
  let item = new itemDictionary[args[0]].itemClass();
  let inv = inventorys.getInventory(message.author.id);
  let canCraft = true;
  if (!item) {
    return await message.channel.send("invalid Crafting item");
  }
  await item.mats.forEach((ele) => {
    if (!inv.hasItem(ele)) {
      message.channel.send("you do not have the material required");
      return (canCraft = false);
    }
    if (ele.quantity > inv.getItem(ele).quantity) {
      message.channel.send(` you do not have enough of **${ele.name}**`);
      return (canCraft = false);
    }
  });
  if (!canCraft) {
    return;
  }
  item.mats.forEach((ele) => {
    if (inv.getItem(ele).quantity > ele.quantity) {
      inv.getItem(ele).quantity -= ele.quantity;
    } else {
      inv.removeItem(ele);
    }
  });
  inv.addItem(item);

  await message.channel.send(`suscessfully crafted: ${item.name}`);
};

const addinv = async (args, message) => {
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

const myinv = (args, message) => {
  // inventorys.printUserInventory(message.author.id);
  const inven = inventorys.getInventory(message.author.id);
  let emn = require("../embeds");
  let em = Object.create(emn.invEmbed);
  em.attachFiles("./gfxs/Inventoryicon.png");
  em.setThumbnail("attachment://Inventoryicon.png");
  let msg = "";
  if (inven.items.length === 0) {
    msg = " Empty ";
  }
  inven.items.forEach((x) => (msg += ` ${x.name} x${x.quantity}\n`));
  em.fields[0].value = `<@!${message.author.id}>`;

  em.fields[1].value = msg;
  message.channel.send(em);
};

const giveitem = (args, message) => {
  let userinv;
  let item = new itemDictionary[args[0]].itemClass();
  if (!inventorys.getInventory(message.author.id)) {
    inventorys.addInventory(message.author.id, message.author.username);
  }
  userinv = inventorys.getInventory(message.author.id);
  if (!userinv.hasItem(item)) {
    userinv.removeItem(item);
  }
  args.forEach((x, i) => {
    if (i != 0) {
      let n = i;
      n += 1;
      if (n % 2 === 0) {
        item[x] = parseInt(args[i + 1]);
      }
    }
  });
  userinv.addItem(item);
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
  myinv,
  item,
  removeinvitem,
  edititem,
  craft,
};

module.exports.dic = dic;
module.exports.inventorys = inventorys;
