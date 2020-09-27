var simulator;
const canv = document.getElementById('board');
const ctx = canv.getContext('2d');
const controls = {};
for (let elem of document.getElementById('form-controls')) {
    controls[elem.id] = elem;
}

//const permUrl = document.getElementById('perm');

const url = new URL(document.location);

const color = {
  fill: (x => ['white', 'black'][x]),
  stroke: 'black'
};

for (let control in controls) {
    const value = url.searchParams.get(control);
    if (value) {
        controls[control].value = value;
    }
}

const functions = {
    start: () => {
        if (!simulator) simulator = functions.init();
        const speed = 2**(controls.speed.value);
        const delay = speed < 1 ? 2/speed : 100;
        const skip = speed > 1 ? speed : 1;
        controls.start.disabled = true;
        controls.stop.disabled = false;
        controls.step.disabled = true;
        simulator.start(skip, delay);
    },

    step: () => {
      if (!simulator) simulator = functions.init();
      if (!simulator.running) {
        simulator.step();
      }
    },

    restart: () => {
      permUrl.href = `?${encodeQueryData(controls)}`
      functions.stop() && functions.start();
    },

    stop: () => {
      simulator && simulator.stop();
      controls.start.disabled = false;
      controls.step.disabled = false;
      controls.stop.disabled = true;
    },

    reset: () => {
      //permUrl.href = `?${encodeQueryData(controls)}`;
      if (simulator && simulator.game) simulator.game.stop();
      ctx.clearRect(0, 0, canv.width, canv.height);
      const cellsize = functions.getSize();
      simulator = functions.init();
      canv.width = controls.size.value * cellsize * 3.5;
      canv.height = controls.size.value * cellsize * 3.5;
      simulator.game.board.draw(ctx, cellsize, [canv.width/2, canv.height/2], color);
    },

    init: () => {
      const board = () => new HexGrid(+controls.size.value);
      const game = new Life(board);
      for (let cell of game.board.getCells()) {
        game.board.set(...cell, Math.floor(Math.random()*2));
      }
      const cellsize = functions.getSize();
      canv.onclick = functions.click;
      return new Simulator(game, () => {
        simulator.game.board.draw(ctx, cellsize, [canv.width/2, canv.height/2], color);
      }).onStop(() => {
        controls.start.disabled = false;
        controls.stop.disabled = true;
        controls.step.disabled = false;
      })
    },

    click: ({offsetX, offsetY}) => {
      const board = simulator.game.board;
      const [px, py] = [offsetX - canv.width/2, offsetY - canv.height/2];
      const [cx, cy, cz] = board.mapToCell(board.mapCell(0, 0, 0), functions.getSize(), [px, py]);
      board.set(cx, cy, cz, +!board.get(cx, cy, cz));
      simulator.draw();
    },

    getSize: () => {
      return controls.size.value > 20 ? (controls.size.value > 50 ? 3 : 5) : 10;
    }
};

controls.start.onclick = functions.start;
controls.stop.onclick = functions.stop;
controls.reset.onclick = functions.reset;
controls.step.onclick = functions.step;
controls.size.onchange = functions.reset;
controls.speed.onchange = functions.restart;

functions.reset();
functions.start();

function encodeQueryData(data) {
   let ret = [];
   for (let d in data)
     if (data[d].value)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d].value));
   return ret.join('&');
}
