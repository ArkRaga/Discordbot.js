// //kill.drops -> char.inventory
// //loop thur the char.inv for materials
// // Item: {id:#000, name:Somename, quanity:Number, quality:[normal,rare,legendary]}

// what commands:
// print player invi
// print player item in inv
// print look up item

// i ={
//     name: furArmor
//     requiredMats: [pelt,pelt,pelt]
// }

// !craft furArmor
//     if furArmor:
//         for i in furarmor.requiredMats:
//             itemininv = user.filter(x=> x.id == furarmor.requiredMats[i].id )
//             if !itemininv:
//                 return "can not make"
//             if itemininv.quan < furarmor.requiredMats[i].quan:
//                 return "not enought of ITem to make furArmor"
//         for i in furArmor.requiredMats:
//             itemininv = user.filter(x=> x.id == furarmor.requiredMats[i].id )
//             if itemininv.quan > furarmor.requiredMats[i].quan:
//                 itemininv.quan -= furarmor.requiredMats[i].quan
//             else:
//                 removeitemfrominv(personid,item)
//         add furarmor to userinv

// const pelt = {
//   id: 1,
//   name: "Pelt",
//   type: "material",
//   quality: "normal",
//   quan: 0,
// };

// const furarmor = {
//   id: 2,
//   name: "Fur Armor",
//   type: "Item",
//   mats: [{ ...pelt, quan: 3 }],
// };

// const dic = { pelt, furarmor };
// module.exports = dic;

// console.log("ITem: ", furarmor.mats);

// var thing1 = require("./gfxs/testItem.png");

var fs = require("fs");

console.log("Test: ", fs.existsSync("./gfxs/thisthing.png"));
// var thing2 = require("./gfxs/newthing.png");

// cosnole.log(`Thing1: ${thing1}`);


turning in qst:
 !turnin
 (check if user has qst)
    loop thur all user qst
        see what ones can be compleated
           --> take materials 
                mark compleates
                    remove from user qst log
        <-----
    tell the player which ones got turned in