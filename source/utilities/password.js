const ui = (($, words) => {
  const dom = {
    output: $('#output'),
    length: $('#length'),
    count: $('#count'),
    stats: $('#stats'),
    cap: $('#cap'),
    delimiter: $('#delimiter')
  };

  const arrayRand = arr => arr[Math.floor(Math.random()*arr.length)];
  const arrayRands = (arr, k) => Array(k).fill(0).map(_ => arrayRand(arr));

  const password = k => arrayRands(words, k)
    .map(dom.cap.checked ? word => word.charAt().toUpperCase() + word.slice(1) : word => word)
    .join(dom.delimiter.value);
  const passwords = (k, n) => Array(n).fill(0).map(_ => password(k));

  const update = () => {
    const length = +dom.length.value;
    dom.output.innerText = passwords(length, +dom.count.value).join('\n');
    const bits = Math.log2(words.length).toFixed(2);
    dom.stats.innerText = `The word list contains ${words.length} words, so a password of length ${length} has ${bits*length} bits of entropy.`;
  }

  dom.length.oninput = dom.count.oninput = dom.delimiter.oninput = dom.cap.onchange = update;

  update();

  return {update, dom, password, passwords}
})(
  document.querySelector.bind(document),
  words
);
