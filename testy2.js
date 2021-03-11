const obj = {
  name: "Connor",
  id: 1,
};
// console.log(obj.acc);

const t = {};

// fs => loop thur a dir{
//     let [in dir get a name] = require([current script path])
//     t.[scriptname] = [exported function]
// }

//import fs to use
const fs = require("fs");
//read directory file
const files = fs.readdirSync("./testdir");

//loop thur each file name and pull out the name and func
files.forEach((file) => {
  //   console.log(file);
  const { func, name } = require(`./testdir/${file}`);
  t[name] = func;
});

//console.log each thing in the dictionary
console.log(t);
for (i in t) {
  t[i]();
}
