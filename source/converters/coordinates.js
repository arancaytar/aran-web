const ui = ($ => {
  const center = 2;

  const cartesian = {
    x: $('#cartesian-x'),
    y: $('#cartesian-y')
  };
  const polar = {
    azimuth: $('#polar-azimuth'),
    radius: $('#polar-radius')
  };
  const output = {
    cartesian: $('#output-cartesian'),
    polar: $('#output-polar'),
    deg: $('#output-polar-deg')
  };

  const dom = {
    svg: {
      canvas: $('#canvas'),
      circle: $('#circle'),
      knob: $('#knob'),
      azimuth: $('#helper-azimuth'),
      cartesian: $('#helper-cartesian'),
    },
    controls: {cartesian, polar},
    output
  };

  const drawCoords = (x, y) => [x + center, center - y];
  const readCoords = (x, y) => {
    return [x - center, center - y];
  };

  const drawRect = (x1, y1, x2, y2) => [
    ...drawCoords(
      Math.min(x1, x2),
      Math.max(y1, y2)
    ),
    Math.abs(x1 - x2),
    Math.abs(y1 - y2)
  ];

  const update = (x, y) => {
    if (x === NaN || y === NaN) return;
    const r = (x**2 + y**2) ** 0.5;
    const [nx, ny] = [x/r, y/r];
    const theta = Math.atan2(ny, nx);

    cartesian.x.value, x.toFixed(3);
    cartesian.x.value = x.toFixed(3);
    cartesian.y.value = y.toFixed(3);
    polar.azimuth.value = theta.toFixed(3);
    polar.radius.value = r.toFixed(3);

    output.cartesian.innerText = `(${x.toFixed(3)}, ${y.toFixed(3)})`;
    output.polar.innerText = `(${theta.toFixed(3)}, ${r.toFixed(3)})`;
    output.deg.innerText = `(${(theta*180/Math.PI).toFixed(3)}°, ${r.toFixed(3)})`;

    const svg = dom.svg;
    const [cx, cy] = drawCoords(nx, ny);
    svg.knob.setAttribute('cx', cx);
    svg.knob.setAttribute('cy', cy);
    svg.azimuth.setAttribute('x2', cx);
    svg.azimuth.setAttribute('y2', cy);
    const [x1, y1, rx, ry] = drawRect(0, 0, nx, ny);
    svg.cartesian.setAttribute('x', x1);
    svg.cartesian.setAttribute('y', y1);
    svg.cartesian.setAttribute('width', rx);
    svg.cartesian.setAttribute('height', ry);
  };

  const updateFromCartesian = e => {
    if (e.inputType === 'insertText') return;
    update(+cartesian.x.value, +cartesian.y.value);
  }
  const updateFromPolar = e => {
    if (e.inputType === 'insertText') return;
    const theta = polar.azimuth.value;
    // Avoid div/0.
    const r = Math.max(polar.radius.value, 0.001);
    update(r * Math.cos(theta), r * Math.sin(theta));
  }
  const updateFromSlider = () => {
    const knob = dom.svg.knob;
    const [x, y] = readCoords(knob.getAttribute('cx'), knob.getAttribute('cy'));
    update(x, y);
  }

  cartesian.x.oninput = cartesian.y.oninput =
  cartesian.x.onchange = cartesian.y.onchange = updateFromCartesian;
  polar.azimuth.oninput = polar.radius.oninput =
  polar.azimuth.onchange = polar.radius.onchange = updateFromPolar;

  const sliderMouseEvent = ({pageX, pageY}) => {
    const knob = dom.svg.knob;
    const {left, top, width, height} = dom.svg.circle.getBoundingClientRect();
    const [x, y] = [2*(pageX - left)/width - 1, 2*(top - pageY)/height + 1];
    const r = (x**2 + y**2)**0.5;
    const [nx, ny] = [x/r, y/r];
    const [cx, cy] = drawCoords(nx, ny);
    knob.setAttribute('cx', cx);
    knob.setAttribute('cy', cy);
    updateFromSlider();
  }

  const state = {dragging: false};

  dom.svg.knob.onmousedown = () => {
    state.dragging = true;
    dom.svg.canvas.style.cursor = 'move';
  };
  document.onmouseup = () => {
    state.dragging = false;
    dom.svg.canvas.style.cursor = 'unset';
  };
  dom.svg.canvas.onmousemove = e => state.dragging && sliderMouseEvent(e);

  return {dom, state};
})(document.querySelector.bind(document));
