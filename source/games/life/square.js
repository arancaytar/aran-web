const SquareGrid = class {
  constructor (size) {
    this.size = size;
    this.data = Array(size*size).fill(0);
  }

  rotate(orientation, angle) {
    return squareRotations[(angle%4+4)%4](orientation);
  }

  _index(x, y) {
    [x, y] = this.wrapTile(x, y);
    return y*this.size + x;
  }

  get(x, y) {
    return this.data[this._index(x, y)];
  }

  set(x, y, v) {
    this.data[this._index(x, y)] = v;
  }

  wrapTile(x, y) {
    return [(x + this.size) % this.size, (y + this.size) % this.size];
  }

  getCells() { return function*() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        yield [x, y];
      }
    }
  }()}

  getNeighbours(x, y) {
    return [
      [x+1, y-1], [x+1, y], [x+1, y+1], [x, y+1],
      [x-1, y+1], [x-1, y], [x-1, y-1], [x, y-1],
    ];
  }

  draw(context, [cx, cy], size, fill) {
    const range = this.radius-1;
    context.strokeStyle = 'black';
    for (y = 0; y < this.size; y++) {
      for (x = 0; x < this.size; x++) {
        context.fillStyle = makeColor(fill(this.get(x, y)));
        const dx = cx + x*size;
        const dy = cy + y*size;
        context.fillRect(dx, dy, dx+size, dy+size);
        if (size > 5) context.strokeRect(dx, dy, dx+size, dy+size);
      }
    }
  }

  mapToCell([cx, cy], size, [x, y]) {
    return [
      Math.floor((x-cx)/size),
      Math.floor((y-cy)/size),
    ];
  }

  add([a, b], [d, e]) {
    return [a+d, b+e];
  }

}

const squareRotations = [
  ([x, y]) => [x, y],
  ([x, y]) => [-y, x],
  ([x, y]) => [-x, -y],
  ([x, y]) => [y, -x],
];
