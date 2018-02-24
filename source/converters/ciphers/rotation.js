const ui = ($ => {
  const english = [
    0.0651738, 0.0124248, 0.0217339, 0.0349835, 0.1041442,
    0.0197881, 0.0158610, 0.0492888, 0.0558094, 0.0009033,
    0.0050529, 0.0331490, 0.0202124, 0.0564513, 0.0596302,
    0.0137645, 0.0008606, 0.0497563, 0.0515760, 0.0729357,
    0.0225134, 0.0082903, 0.0171272, 0.0013692, 0.0145984, 0.0007836];

  const dom = {
    input: $('#input'),
    output: $('#output'),
    buttons: {
      rot13: $('#button-rot13'),
      guess: $('#button-guess'),
      invert: $('#button-invert')
    },
    shift: $('#shift')
  };

  const rotate = (text, shift) => Array.from(text)
    .map(c => {
      const i = c.charCodeAt(0);
      if (i >= 97 && i <= 122) {
        return (i + shift - 97) % 26 + 97;
      }
      if (i >= 65 && i <= 90) {
        return (i + shift - 65) % 26 + 65;
      }
      return i;
    })
    .map(i => String.fromCharCode(i))
    .join('');

  const guessShift = text => {
    const cipher = countFrequency(text);
    let best = 26;
    let index = 0;

    for (let i = 0; i < 26; i++) {
      const score = getScore(english, cipher);
      if (score < best) {
        index = i;
        best = score;
      }
      cipher.push(cipher.shift(1));
    }
    return index;
  }

  const getScore = (a, b) => {
    if (a.length != b.length) return;
    let score = 0;
    for (let i = 0; i < a.length; i++) {
      score += (a[i] - b[i])**2;
    }
    return score;
  }

  const countFrequency = text => {
    text = text.toLowerCase().replace(/[^a-z]/g, '');
    const freq = Array(26).fill(0);
    for (let i = 0; i < text.length; i++) {
      freq[text.charCodeAt(i) - 97]++;
    }

    if (text.length > 1) {
      for (let i in freq) {
        freq[i] /= text.length;
      }
    }
    return freq;
  }

  const update = () => {
    const input = dom.input.value;
    const shift = dom.shift.value;
    dom.output.innerText = rotate(input, +shift)
    dom.output.hidden = !input;
  }

  dom.input.oninput = dom.shift.oninput = update;

  dom.buttons.invert.onclick = () => {
    dom.input.value = dom.output.innerText;
    dom.shift.value = (26 - dom.shift.value) % 26;
    update();
  };

  dom.buttons.rot13.onclick = () => {
    dom.shift.value = 13;
    update();
  };

  dom.buttons.guess.onclick = () => {
    dom.shift.value = (26 - guessShift( dom.input.value)) % 26;
    update();
  }

  return {dom, update, rotate, guessShift, countFrequency};
})(document.querySelector.bind(document));
