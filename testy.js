class Combat {
  constructor({ id, player }) {
    this.id = id;
    this.player = player;
    this.player.damage = 0;
  }
}

class Player {
  constructor({ name, bclass }) {
    this.name = name;
    this.bclass = bclass;
  }
}

const p = new Player({ id: 0, name: "tony", bclass: "ironman" });

const c = new Combat({ id: 0, player: p });

console.log("CLasss C: ", c);
