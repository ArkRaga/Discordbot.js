// const fetch = require("node-fetch");
// const tesJson = require("./test.json");
// let arr = ["this", "that", "then", "fizz", "buzz"];

const { embed } = require("./Bot/generalCommands")

// let target = [];

// let url = encodeURI("the Devil is a part-timer");

// console.log("Url", tesJson.data[0].attributes.canonicalTitle);

// fetch("./test.json")
//   .then((response) => response.json())
//   .then((data) => console.log(data));

// async func(args){

//   await get - anime api {args}
//   let  =anime = res

//   em.title = anime.title
//   em.des  = anime.des
//   linkto= anime.link
//   return em

// }

// const dic1 = {
//   a: "a",
//   b: "b",
//   c: "c",
// };

// const dic2 = {
//   d: "d",
//   e: "e",
//   f: "f",
// };

// const dic3 = {
//   h: "h",
//   i: "i",
//   j: "j",
// };

// const gen = require("./Bot/generalCommands").dic;
// const allDic = {
//   ...dic1,
//   ...gen,
// };

// console.log(allDic);


>>> put players in combat
      game loop -->
        ---> do player 1 turn
          <--  check health/change state
          -->do players 2 turn
          <-- checkhealth/changestate
      <--hp <=0 - state = endgame
    -->end game embed
<---- take players out of combat


enum of states
player 1
player 2 
