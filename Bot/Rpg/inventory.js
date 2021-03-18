// const inventorys = [];
const { itemDictionary } = require("./items");
const fs = require("fs");
const { ItemTypes } = require("./items");
const database = require("../databaseing");

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
      //change quantity in database
      let itm = {
        player_id: this.id,
        item_id: item.id,
        item_quantity: i.quantity,
      };
      database.updateItemInDatabase(this.id, itm);
    } else {
      this.items.push(item);
      // add item to database
      database.addUserItemToDatabase(this.id, item);
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
    return this.inventories.some((x) => x.id == id);
  }
  getInventory(id) {
    const i = this.inventories.find((x) => x.id === id);
    return i;
  }
  removeInventory(id) {
    this.inventories = this.inventories.filter((x) => x.id !== id);
  }
}

const startUp = async () => {
  let u;
  let invs;
  await database
    .getAllUsers()
    .then((users) => (u = users))
    .catch((err) => console.log("err gettins users L-101-invetory"));
  await database
    .getAllInv()
    .then((inv) => (invs = inv))
    .catch((err) => console.log("err getting invs L-105-inventory"));

  // console.log("heres U: ", u);
  // console.log("heres I: ", i);

  if (!u) {
    return;
  }
  u.forEach((users) => {
    let arr = invs.filter((inv_item) => inv_item.player_id == users.discordId);
    if (arr.length > 0) {
      inventorys.addInventory(users.discordId, users.username);
      arr.forEach((item) => {
        for (i in itemDictionary) {
          if (itemDictionary[i].id == item.item_id) {
            const itm = itemDictionary[i];
            itm.quantity = item.item_quantity;
            inventorys.getInventory(item.player_id).items.push(itm);
          }
        }
      });
    }
  });
  console.log(" Inventories L118-Done");
};

const inventorys = new usersInventoryHandler();
// console.log("inv");
startUp();

const itemEmbed = (item) => {
  let emn = require("../embeds");
  let em;
  // em.files = [];
  // em.fields = [];

  if (item.type == "material") {
    em = Object.create(emn.itemEmbed);
    em.fields[0].value = item.name;
    em.fields[1].value = "Material";
    em.fields[2].value = getDropBy(item);
    // em.fields[2].value = "null for now";
  }
  if (item.type == "crafteditem") {
    em = Object.create(emn.crafteditemEmbed);
    em.fields[0].value = item.name;
    em.fields[1].value = "Crafted item";
    let m = "";
    item.mats.forEach((x) => (m += ` **${x.name}** x${x.quantity}, \n`));
    em.fields[2].value = m;
    em.fields[2].inline = true;
    em.fields[3].value = getDropBy(item);
    // em.fields[3].value = "null for now";
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
  if (args.length <= 0) {
    return await message.channel.send("please enter an item to craft");
  } else {
    if (!itemDictionary[args[0]]) {
      return await message.channel.send("sorry invaild item");
    }
  }
  let item = new itemDictionary[args[0]]();
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

const item = async (args, message) => {
  switch (args[0]) {
    case "name": {
      let SelectedItem = itemDictionary[args[1]];
      await message.channel.send(itemEmbed(SelectedItem));
      break;
    }
    case "id": {
      for (i in itemDictionary) {
        if (itemDictionary[i].id == args[1]) {
          let SelectedItem = itemDictionary[i];
          await message.channel.send(itemEmbed(SelectedItem));
        }
      }
      break;
    }
    default: {
      if (!itemDictionary[args[0]]) {
        return await message.channel.send("no item found please try again");
      }
      let SelectedItem = itemDictionary[args[0]];
      if (SelectedItem) {
        await message.channel.send(itemEmbed(SelectedItem));
      } else {
        await message.channel.send("no item found please try again");
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
  if (!inventorys.hasInventory(message.author.id)) {
    return message.channel.send("you have no items");
  }
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
  let item = itemDictionary.createDrop(args[0], 1);
  console.log("L-309-giveitem: ", item);
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
  console.log("inv: ", inventorys.inventories);
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
