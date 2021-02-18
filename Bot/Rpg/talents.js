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
    super({ id: 0, name: "warm Light", desc: "Heal 1-3 hp every 3 turns." });
    this.healamt;
    this.msg;
  }
  doTalent(combat, p1) {
    this.healamt = Math.round(Math.random() * 2 + 1);
    this.msg = `By the light you are healed for ${this.healamt}\n`;
    let n = combat.turn % 3;
    if (n === 0) {
      combat[p1].hp += this.healamt;
      return true;
    }
    return false;
  }
}

const dic = {
  HealOnTurn,
};

module.exports.talents = dic;
