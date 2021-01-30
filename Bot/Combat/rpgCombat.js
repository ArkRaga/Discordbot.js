const actions = {
  START: "start",
  ONGOING: "ongoing",
  END: "end",
};

class Combat {
  constructor({ id, player, enemy }) {
    this.id = id;
    this.turn = 0;
    this.lastaction = actions.START;
    this.player = player;
    this.playerDamage = 0;
    this.enemy = enemy;
    this.enemyDamage = 0;
    this.winner = false;
  }
  changeTurn() {
    this.turn += 1;
  }
  changePlayerDamage(n) {
    this.playerDamage = n;
  }
  changeEnemyDamage(n) {
    this.enemyDamage = n;
  }
  changeLastAction(a) {
    this.lastaction = actions[a];
  }
  checkHp() {
    if (this.player.hp <= 0 || this.enemy.hp <= 0) {
      if (this.player.hp <= 0) {
        this.winner = this.enemy;
      } else {
        this.winner = this.player;
      }
    }
  }
}

class Player {
  constructor({ id, name }) {
    this.discordId = id;
    this.name = name;
    this.hp = 10;
  }
  changeHp(dmg) {
    this.hp -= dmg;
  }
}

class CombatHandler {
  constructor() {
    this.combats = [];
    this.id = 0;
  }
  addCombat(combat) {
    this.combats.push(combat);
  }
  removeombat(combat) {
    let newarr = this.combats.filter((x) => x.id != combat.id);
    this.combats = newarr;
  }
}
