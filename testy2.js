const arr = [3, 20, 15, 94, 6];

arr.forEach((x) => {
  console.log("X", x);
  let n = x % 3;
  if (n == 0) {
    console.log("yes: ", x % 3);
  }
});
