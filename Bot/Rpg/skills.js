const status = {
  NONE: "none",
  BLEED: "bleed",
  STUN: "stun",
  POISON: "poison",
  CONFUSSED: "confussed",
};

class Status {
  constructor({ duration, damage, msg }) {
    this.duration = duration;
    this.damage = damage;
    this.msg = msg;
  }
  doStatus() {}
}

class Bleed extends Status {
  constructor() {
    super({
      duration: 3,
      damage: 1,
      msg: ` takes 1 damage due to bleeding \n`,
    });
    this.endTurn = 0;
  }
  doStatus(combat, player) {
    combat[player].hp -= 1;
    if (combat.turn === this.endTurn) {
      combat[player].isAfflicted = false;
      this.msg += " the affliction has worn off\n";
      this.endTurn = 0;
    }
    return combat[player].name + this.msg;
  }
}

class Skill {
  constructor({ name, stat = status.NONE, msg }) {
    this.name = name;
    this.status = stat;
    this.msg = msg;
  }
  doSkill() {}
  doReset() {}
}

class Basic extends Skill {
  constructor() {
    super({
      name: "basic attack",
      msg: "attacks",
    });
  }
  doSkill(combat, p1, p2) {
    combat[p2].hp -= combat[p1].damage;
    return combat[p1].name + ` attacked for ${combat[p1].damage} damage \n`;
  }
}

class Heal extends Skill {
  constructor() {
    super({
      name: "Heal",
      msg: "Has healed for",
    });
  }
  doSkill(combat, p1) {
    combat[p1].hp += 2;
    if (combat[p1].hp > combat[p1].maxHp) {
      combat[p1].hp = combat[p1].maxHp;
    }
    return combat[p1].name + ` has heald for 2 \n`;
  }
}

class Swordstrike extends Skill {
  constructor() {
    super({
      name: "Sword Strike",
      status: status.BLEED,
      msg: " performs A heavy downward sword strike",
    });
    this.afflict = false;
  }
  doReset() {
    this.afflict = false;
  }
  doSkill(combat, p1, p2) {
    combat[p1].damage = 4;
    combat[p2].hp -= combat[p1].damage;
    if (!this.afflict) {
      let a = new Bleed();
      a.endTurn = a.duration + combat.turn;
      combat[p2].affliction = a;
      combat[p2].isAfflicted = true;
      this.afflict = true;
      return (
        combat[p1].name +
        this.msg +
        ` for ${combat[p1].damage} damage\n ${combat[p1].name} has inflicted Bleed \n`
      );
    }
    return combat[p1].name + this.msg + ` ${combat[p1].damage} damage \n`;
  }
}

class Bite extends Skill {
  constructor() {
    super({
      name: "Bite",
      status: status.BLEED,
      msg: " bites down and thrashes about befor letting go",
    });
  }
  doSkill(combat, p1, p2) {
    combat[p1].damage = 3;
    combat[p2].hp -= combat[p1].damage;
    return combat[p1].name + this.msg + ` for ${combat[p1].damage} damage\n`;
  }
}

class Roar extends Skill {
  constructor() {
    super({
      name: "Roar",
      status: status.STUN,
      msg: " unleashes a loud roar giving them +1 strength",
    });
  }
  doSkill(combat, p1, p2) {
    combat[p1].damage += 1;
    combat[p2].hp -= combat[p1].damage;
    return combat[p1].name + this.msg + ` for ${combat[p1].damage} damage\n`;
  }
}

class Swipe extends Skill {
  constructor() {
    super({
      name: "Swipe",
      status: status.NONE,
      msg: " quicky strikes with their claws",
    });
  }
  doSkill(combat, p1, p2) {
    combat[p1].damage = 3;
    combat[p2].hp -= combat[p1].damage;
    return combat[p1].name + this.msg + ` for ${combat[p1].damage} damage\n`;
  }
}

const dic = { Basic, Bite, Roar, Swordstrike, Swipe, Heal };
module.exports = dic;
