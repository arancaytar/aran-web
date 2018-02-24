const HexGrid = class {
  constructor(radius) {
    this.radius = radius;
    this.offset = radius - 1;
    this.size = 2*radius - 1;
    this.data = Array(this.size*this.size).fill(0);
    this.mirrors = [
      [0, 0, 0],
      [radius, 1-2*radius, radius-1],
      [1-radius, -radius, 2*radius-1],
      [1-2*radius, radius-1, radius],
      [-radius, 2*radius-1, 1-radius],
      [radius-1, radius, 1-2*radius],
      [2*radius-1, 1-radius, -radius],
    ];
  }

  rotate(orientation, angle) {
    return hexRotations[(angle%6+6)%6](orientation);
  }

  _index(x, y, z) {
    [x, y, z] = this.wrapTile(x, y, z);
    return (y + this.radius - 1) * this.size + (x + this.radius - 1);
  }

  get(x, y, z) {
    return this.data[this._index(x, y, z)];
  }

  set(x, y, z, v) {
    this.data[this._index(x, y, z)] = v;
  }

  add([a, b, c], [d, e, f]) {
    return [a+d, b+e, c+f];
  }

  getCells() { return function*(_this) {
    const range = _this.radius-1;
    for (let x = -range; x <= range; x++) {
      const m = Math.min(range, range-x);
      for (let y = Math.max(-range, -x-range); y <= m; y++) {
        yield [x, y, -x-y];
      }
    }
  }(this)}

  getNeighbors(x, y, z) {
    return [
      [x+1, y-1, z],
      [x+1, y, z-1],
      [x, y+1, y-1],
      [x-1, y+1, z],
      [x-1, y, z+1],
      [x, y-1, z+1],
    ]
  }

  magnitude(...p) {
    return Math.max(...p.map(Math.max));
  }

  wrapTile(x, y, z) {
    let closest = [x, y, z];
    let minimum = this.magnitude(x, y, z);
    while (minimum >= this.radius) {
      for (let [cx, cy, cz] of this.mirrors) {
        const diff = [x-cx, y-cy, z-cz];
        const distance = magnitude(...diff);
        if (distance < this.radius) return diff;
        else if (distance < minimum) {
          closest = diff;
          minimum = distance;
        }
      }
    }
    return closest;
  }

  /**
   * Map a cell on an XY plane with origin 0,0 and unit cell radius.
   */
  mapCell(x, y, z) {
    [x, y, z] = this.wrapTile(x, y, z);
    const height = 2;
    const width = Math.sqrt(3)/2 * height;
    return [
      width * (x + y/2),
      height * y * 0.75,
    ];
  }

  mapToCell([cx, cy], size, [px, py]) {
    const dx = px - cx;
    const dy = px - cy;
    const x = (dx * sqrt(3)/3 - dy / 3) / size;
    const z = dy * 2/3 / size;
    const y = -x-z;

    let [rx, ry, rz] = [Math.round(x), Math.round(y), Math.round(z)];

    if (rx+ry+rz !== 0) {
      const dr = [Math.abs(r[0]-x), Math.abs(r[1]-y), Math.round(r[2]-z)];
      const m = Math.max(...dr);
      if (m === dr[0]) {
        rx = -ry-rz;
      }
      else if (m === dr[1]) {
        ry = -rx-rz;
      }
      else {
        rz = -rx-ry;
      }
    }
    return [rx, ry, rz];
  }

  draw(context, radius, [cx, cy], {stroke, fill}) {
    const range = this.radius-1;
    for (let [x, y, z] of this.getCells()) {
      const state = this.get(x, y, z);
      const [w, h] = this.mapCell(x, y, z);
      const vertices = polygon(6, [cx+radius*w, cy+radius*h], 1/12, radius);
      drawPolygon(context, vertices, {stroke, fill: fill(state)});
    }
  }
};


const drawHex = (context, center, size, fill) => {
  context.beginPath();
  const corners = polygon(6, center, 1/6, size);
  context.moveTo(...corners[5]);
  for (let [dx, dy] of vertices) {
    context.lineTo(...corner);
  }
  context.fillStyle = `rgb(${fill.join(', ')})`;
  context.fill();
  if (size > 5) context.stroke();
  context.closePath();
}

const hexRotations = [
  ([x, y, z]) => [ x,  y,  z],
  ([x, y, z]) => [-y, -z, -x],
  ([x, y, z]) => [ z,  x,  y],
  ([x, y, z]) => [-x, -y, -z],
  ([x, y, z]) => [ y,  z,  x],
  ([x, y, z]) => [-z, -x, -y],
];
