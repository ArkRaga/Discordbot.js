// const fetch = require("node-fetch");
// const tesJson = require("./test.json");
// let arr = ["this", "that", "then", "fizz", "buzz"];

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

let testJSON = [
  {
    name: "John",
    age: 21,
    language: ["JavaScript", "PHP", "Python"],
  },
  {
    name: "Smith",
    age: 25,
    language: ["PHP", "Go", "JavaScript"],
  },
];

console.log(testJSON.find((x) => x.name === "John"));
