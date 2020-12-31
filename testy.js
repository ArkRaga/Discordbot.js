let arr = ["this", "that", "then", "fizz", "buzz"];

let target = "fizz";

for (let i in arr) {
  if (arr[i] === target) {
    arr.splice(i, 1);
  }
}

console.log(1234 == "1234");
