class Talent {
  constructor({ id, name, desc }) {
    this.id = id;
    this.name = name;
    this.desc = desc;
  }
  doTalent() {}
}

class HealOnTurn extends Talent {
  constructor() {
    super({ id: 0, name: "warm Light", desc: "Heal 1 hp every turn." });
  }
  doTalent(combat, p1) {
    let n = combat.turn % 3;
    if (n === 0) {
      combat[p1].hp += 1;
      return true;
    }
    return false;
  }
}

const dic = {
  HealOnTurn,
};

module.exports.talents = dic;
