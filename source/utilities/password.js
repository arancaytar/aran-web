const ui = (($, wordsOriginal) => {
  let words = wordsOriginal;

  const dom = {
    output: $('#output'),
    length: $('#length'),
    count: $('#count'),
    avoid: $('#avoid'),
    stats: $('#stats'),
    cap: $('#cap'),
    delimiter: $('#delimiter'),
    regenerate: $('#regenerate')
  };
  const state = {
    passwords: [],
  }

  const random = k => Array.from(window.crypto.getRandomValues(new Uint32Array(k))).map(x => x / 2**32);

  const arrayRands = (arr, k) => random(k).map(x => arr[Math.floor(x * arr.length)]);

  const password = k => arrayRands(words, k);
  const passwords = (k, n) => Array(n).fill(0).map(_ => password(k));

  const setWordList = avoid => {
    const avoidLetters = avoid.toLowerCase().split('');
    words = wordsOriginal.filter(
      word => (word => avoidLetters.every(
        letter => !word.includes(letter)
      ))(word.toLowerCase())
    );
  }

  const update = () => {
    dom.output.innerHTML = '';
    state.passwords.forEach(
      p => {
          const x = document.createElement('p');
          x.innerText = p.map(
              dom.cap.checked ? word => word.charAt().toUpperCase() + word.slice(1)
                  : word => word.toLowerCase()
          ).join(dom.delimiter.value);
          x.onclick = () => {
            x.select();
            document.execCommand('copy');
          };
          dom.output.appendChild(x);
      }
    );
  };

  const regenerate = () => {
    setWordList(dom.avoid.value);
    const length = +dom.length.value;
    const bits = Math.log2(words.length).toFixed(2);
    state.passwords = passwords(length, +dom.count.value);
    if (words.length) {
      dom.stats.innerText = `The word list contains ${words.length} words, so a password of length ${length} has ${bits*length} bits of entropy.`;
    }
    else {
      dom.stats.innerText = `The word list is empty; no passwords can be generated.`;
      state.passwords = [];
    }
    update();
  }

  dom.delimiter.oninput = dom.cap.onchange = update;
  dom.regenerate.onclick = dom.count.oninput = dom.length.oninput = dom.avoid.oninput = regenerate;

  regenerate();

  return {update, dom, password, passwords}
})(
  document.querySelector.bind(document),
  words
);
