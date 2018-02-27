const ui = (($, words) => {
  const dom = {
    output: $('#output'),
    length: $('#length'),
    count: $('#count'),
    stats: $('#stats'),
    cap: $('#cap'),
    delimiter: $('#delimiter'),
    regenerate: $('#regenerate')
  };
  const state = {
    passwords: [],
  }

  const arrayRand = arr => arr[Math.floor(Math.random()*arr.length)];
  const arrayRands = (arr, k) => Array(k).fill(0).map(_ => arrayRand(arr));

  const password = k => arrayRands(words, k);
  const passwords = (k, n) => Array(n).fill(0).map(_ => password(k));

  const update = () => {
    dom.output.innerText = state.passwords.map(
      p => p.map(
        dom.cap.checked ? word => word.charAt().toUpperCase() + word.slice(1)
        : word => word.toLowerCase()
      )
      .join(dom.delimiter.value)
    ).join('\n');
  }

  const regenerate = () => {
    const length = +dom.length.value;
    const bits = Math.log2(words.length).toFixed(2);
    state.passwords = passwords(length, +dom.count.value);
    dom.stats.innerText = `The word list contains ${words.length} words, so a password of length ${length} has ${bits*length} bits of entropy.`;
    update();
  }

  dom.delimiter.oninput = dom.cap.onchange = update;
  dom.regenerate.onclick = dom.count.oninput = dom.length.oninput = regenerate;

  regenerate();

  return {update, dom, password, passwords}
})(
  document.querySelector.bind(document),
  words
);
