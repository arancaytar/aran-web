const HSVtoRGB = (h, s, v) => {
  if (h.length) {
    [h, s, v] = h;
  }

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = Math.round(v * (1 - s) * 255);
  const q = Math.round(v * (1 - f * s) * 255);
  const t = Math.round(v * (1 - (1 - f) * s) * 255);
  const w = Math.round(v * 255);
  switch (i % 6) {
    case 0: return [w, t, p];
    case 1: return [q, w, p];
    case 2: return [p, w, t];
    case 3: return [p, q, w];
    case 4: return [t, p, w];
    case 5: return [w, p, q];
  }
}

const polygon = (v, [x, y], rotation, radius) => {
  const pos = Array(6);
  let theta = 2 * Math.PI * rotation;
  let tau = 2 * Math.PI / v;
  for (let i = 0; i < 6; i++) {
    pos[i] = [
      x + radius * Math.cos(theta),
      y + radius * Math.sin(theta)
    ];
    theta += tau;
  }
  return pos;
};

const drawPolygon = (context, vertices, {stroke, fill}) => {
  context.beginPath();
  context.moveTo(...vertices[vertices.length-1]);
  for (let vertex of vertices) {
    context.lineTo(...vertex);
  }
  if (fill) {
    context.fillStyle = makeColor(fill);
    context.fill();
  }
  if (stroke) {
    context.strokeStyle = makeColor(stroke);
    context.stroke();
  }
  context.closePath();
}

const makeColor = color => {
  if (color.length in [3, 4] && isFinite(color[0])) {
    return `rgb${color.length == 4 ? 'a' : ''}(${color.join(', ')})`;
  }
  return String(color);
}

const gradient = ([a, b, c], [d, e, f], steps) => {
  const dh = d-a;
  const ds = e-b;
  const dc = f-c;
  const colors = Array(steps)
  for (let i = 0; i < steps; i++) {
    colors[i] = [a+dh*i, b+ds*i, c+dc*i];
  }
}

const Simulator = class {
  constructor(game, draw) {
    this.game = game;
    this.draw = draw;
  }

  step() {
    this.game.step();
    this.draw();
  }

  start(stepsize, delay) {
    console.log("starting");
    if (this.running) return;
    let step = false;
    this.running = setInterval(() => {
      if (step) return;
      step = true;
      let change = true;
      for (let i = 0; i < stepsize && change; i++) change = change && this.game.step();
      this.draw();
      step = false;
      if (!change) this.stop();
    }, delay);
  }

  stop() {
    if (this.running) clearInterval(this.running);
    this.running = null;
    if (this.stopTrigger) {
      this.stopTrigger();
    }
  }

  onStop(fn) {
    this.stopTrigger = fn;
    return this;
  }

}
