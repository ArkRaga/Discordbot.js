const dic = [];
const classes = require("./Bot/Rpg/rpgClasses");
var ch1 = Object.create(classes.knight);
var ch2 = Object.create(classes.priest);
ch1.wins = 0;
ch1.hp = 25;
ch1.dmg = 0;
ch1.atks = 0;
ch1.misses = 0;
ch1.turns = 0;
ch1.first = 0;
ch1.mod = 25 + ch1.str;
ch2.mod = 25 + ch2.speed;
ch2.first = 0;
ch2.turns = 0;
ch2.misses = 0;
ch2.atks = 0;
ch2.dmg = 0;
ch2.hp = 25;
ch2.wins = 0;
var turn = 0;
var miss = false;
var pturn = "ch1";
var times = 0;
var maxtime = 100;

console.log(
  `Ch1: ${ch1.name} str: ${ch1.str}, def: ${ch1.def}, spd: ${ch1.speed}`
);
console.log(
  `Ch2: ${ch2.name} str: ${ch2.str}, def: ${ch2.def}, spd: ${ch2.speed}`
);

const reset = () => {
  pturn = "ch1";
  ch1.hp = 25;
  ch2.hp = 25;
  turn = 0;
};

const doMath = (mod) => {
  modI = 100 + mod;
  var rn = Math.round(Math.random() * modI + 1);
  rn = Math.round(rn / 10);
  return rn;
};

const combat = (c1, c2, rn1, rn2) => {
  turn += 1;
  var dmgTobeDone = c1.str + rn1;
  if (c1.name != "Priest") {
    dmgTobeDone -= c2.def;
  } else {
    dmgTobeDone -= Math.round(c2.def * 0.9);
  }
  // dmgTobeDone -= c2.def;
  if (dmgTobeDone <= 0) {
    dmgTobeDone = 1;
  }
  if (rn2 < c2.speed) {
    miss = true;
  } else {
    miss = false;
  }
  if (!miss) {
    c1.atks += 1;
    c2.hp -= dmgTobeDone;
    if (c1.dmg < dmgTobeDone) {
      c1.dmg = dmgTobeDone;
    } else {
      c1.misses += 1;
    }
  }

  return checkhp(c1, c2);
};

const checkhp = (c1, c2) => {
  if (c1.hp <= 0 || c2.hp <= 0) {
    if (c1.hp <= 0) {
      c2.wins += 1;
      // console.log(`${c2.name} Has won`);
    } else {
      c1.wins += 1;
      // console.log(`${c1.name} Has won`);
    }
    times += 1;
    // console.log("End Match");
    // console.log("-                     -");
    return docombat();
  }

  c1.turns += 1;
  // console.log(turn, "  turn ---- ", c1.name);
  return combat(c2, c1, doMath(c2.mod), doMath(c1.mod));
};

const docombat = () => {
  if (times === maxtime) {
    console.log(
      `${ch1.name} has: ${ch1.wins} wins, ${ch1.misses} misses, ${ch1.dmg} highest dmg, ${ch1.atks} atks. ${ch1.turns} turns ${ch1.first} times gone first`
    );
    console.log(
      `${ch2.name} has: ${ch2.wins} wins, ${ch2.misses} misses, ${ch2.dmg} highest dmg, ${ch2.atks} atks. ${ch2.turns} turns ${ch2.first} times gone first`
    );
    return;
  }
  var rn3 = Math.floor(Math.random() * 10 + 1);
  reset();
  if (rn3 >= 5) {
    ch1.first += 1;
    pturn = "ch1";
    return combat(ch1, ch2, doMath(ch1.mod), doMath(ch2.mod));
  } else {
    pturn = "ch2";
    ch2.first += 1;
    return combat(ch2, ch1, doMath(ch2.mod), doMath(ch1.mod));
  }
};

docombat();
