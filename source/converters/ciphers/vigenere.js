const ui = ($ => {
  const dom = {
    input: $('#input'),
    output: $('#output'),
    key: $('#key'),
    direction: $('#direction')
  };

  const readKey = (key, sign=1) => Array.from(key.toLowerCase().replace(/[^a-z]/g, ''))
    .map(c => ((c.charCodeAt(0) - 97)*sign+26)%26);

  const vigenere = (text, key, sign=1) => {
    const shifts = readKey(key, sign);
    const k = shifts.length;

    if (k === 0) return '';
    let ki = 0;

    return Array.from(text)
      .map(c => {
        const i = c.charCodeAt(0);
        if (i >= 97 && i <= 122) {
          return (i + shifts[(ki++)%k] - 97) % 26 + 97;
        }
        if (i >= 65 && i <= 90) {
          return (i + shifts[(ki++)%k] - 65) % 26 + 65;
        }
        return i;
      })
      .map(i => String.fromCharCode(i))
      .join('');
  };

  const update = () => {
    document.location.hash = dom.direction.checked ? 'decrypt' : '';
    const key = dom.key.value;
    const sign = dom.direction.checked ? -1 : 1;
    const input = dom.input.value;

    const output = vigenere(input, key, sign);
    dom.output.innerText = output;
    dom.output.hidden = !output;
  }

  dom.input.oninput = dom.key.oninput = dom.direction.onchange = update;

  if (document.location.hash === '#decrypt') {
    dom.direction.checked = true;
  }

  return {
    dom,
    update,
    vigenere,
  }

})(document.querySelector.bind(document));
