const Isotropic = class {
  constructor(board, size, trans) {
    this.board = board();
    this.board2 = board();
    this.size = size;
    this.trans = trans;
  }

  step() {
    const board = this.board;
    let change = false;
    for (let cell of board.getCells()) {
      const neighborhood = Array(this.size).fill(0);
      for (let neighbor of board.getNeighbors(...cell)) {
        neighborhood[board.get(...neighbor)]++;
      }
      this.board2.set(...cell, this.trans(board.get(...cell), ...neighborhood));
      change = change || this.board2.get(...cell) !== board.get(...cell);
    }
    this.board = this.board2;
    this.board2 = board;
    return change;
  }
}

const Life = class extends Isotropic {
  constructor(factory, rules=[[3], [2, 3]]) {
    const compile = (born, survive) => {
      const transform = [{}, {}];
      for (let i of born) {
        transform[0][i] = 1;
      }
      for (let i of survive) {
        transform[1][i] = 1;
      }
      return transform;
    };
    const m = compile(...rules);
    const fn = (me, dead, alive) => +!!m[me][alive];
    super(factory, 2, fn);
  }

}

const WireWorld = class extends Isotropic {
  constructor(factory) {
    super(factory, (me, dead, live, head, tail) => {
      switch (me) {
        case 0: return 0;
        case 2: return 3;
        case 3: return 1;
        case 1: return head == 2 ? 2: 1;
      }
    })
  }
}

const BrianBrain = class extends Isotropic {
  constructor(factory) {
    super(factory, (me, dead, live, dying) => {
      switch (me) {
        case 2: return 0;
        case 1: return 2;
        case 0: return live == 2 ? 1: 0;
      }
    });
  }
}
