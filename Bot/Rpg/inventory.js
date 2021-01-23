inventorys = [];
var items = require("./items");

/*
iventory:
    discordid: person.id
    items:[]
*/

/*
commnads
add,edit,delete
*/
const addinv = (args, message) => {
  message.channel.send("it has be done");
  inv = {
    discordid: message.author.id,
    items: [],
  };
  inventorys.push(inv);
};

const printinv = () => {
  console.log("inv: ", inventorys);
};

const printitem = () => {
  console.log("Item: ", inventorys[0].items);
};

const giveitem = (args, message) => {
  var userinv = inventorys.filter((x) => (x.discordid = message.author.id));
  var i = userinv[0].items.filter((x) => x.id == items[args[0]].id);
  console.log("i: ", i);
  if (i.length > 0) {
    if (!i[0].quanity) {
      i[0].quanity = 2;
    } else {
      i[0].quanity += 1;
    }
    console.log("I at 0: ", i[0]);
  } else {
    userinv[0].items.push(items[args[0]]);
  }
  console.log("pushed : ", items[args[0]]);
};

const dic = { addinv, printinv, printitem, giveitem };

exports.inventorys = inventorys;
exports.dic = dic;
