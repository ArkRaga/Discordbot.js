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
    this.msg = ` **Talent** By the light you are healed for ${this.healamt}\n`;
    let n = combat.turn % 3;
    if (n === 0) {
      combat[p1].hp += this.healamt;
      return true;
    }
    return false;
  }
}

class Combo extends Talent {
  constructor() {
    super({
      id: 0,
      name: "Combo",
      desc: "do 1 extra damage per 2 combo points. resets on miss or stun",
    });
    this.comboPoints = 0;
    this.msg = ` **Talent** Combo chain has gained you 1 extra damage\n`;
  }
  doTalent(combat, player) {
    let enemy = player === "player" ? "enemy" : "player";
    this.comboPoints += 1;
    if (combat[player].damage <= 0 || combat[player].lastAction === "defend") {
      this.comboPoints = 0;
    }

    if (this.comboPoints === 3) {
      combat[enemy].damage -= 1;
      this.comboPoints = 0;
      return true;
    }
    return false;
  }
}

const dic = {
  HealOnTurn,
  Combo,
};

module.exports.talents = dic;
