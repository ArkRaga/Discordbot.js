class human {
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
    this.startingHp = 10;
  }
}

class Jhon extends human {
  constructor({ name, bclass }) {
    super({ id: 2, name: name });
    this.bclass = bclass;
  }
}

class Ging extends human {
  constructor({ name, bclass }) {
    super({ id: 3, name: name });
    this.bclass = bclass;
  }
}

const jhon = new Jhon({ name: "jhon", bclass: "pirate" });
const ging = new Ging({ name: "ging", bclass: "Bitty-Kween" });

console.log(`Jhon: ${jhon.startingHp}, Ging:${ging.startingHp}`);

human.startingHp = 30;

console.log(`Jhon: ${jhon.startingHp}, Ging:${ging.startingHp}`);
