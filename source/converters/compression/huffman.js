const huffman = (() => {
  const huffman = input => huffman.tree(huffman.countFrequency(input));

  huffman.encode = (tree, input) => {
    const e = {};
    for (let [r, c] of huffman.code(tree)) e[r] = c;
    const codes = Array.from(input).map(c => e[c]);
    const i = codes.indexOf(undefined);
    if (i >= 0) throw `Bad character ${input[i]}.`;
    return codes.join('');
  };
  huffman.decode = (tree, bits) => {
    let n = tree;
    const out = [];
    bits = Array.from(bits);
    bits.push(2);
    let j = 0;
    for (let i in bits) {
      if (n === undefined) throw `Bad sequence ${bits.slice(j, i)} at #${j}.`;
      if (n.constructor !== Array) {
        out.push(n);
        n = tree;
        j = i;
      }
      n = n[bits[i]];
    }
    return out.join('');
  };

  huffman.countFrequency = input => {
    const counts = {};
    Array.from(input).forEach(c => {
      counts[c] = 1 + (counts[c] || 0);
    });
    return counts;
  };

  huffman.tree = frequencies => {
    const heap = new Heap();
    for (let c in frequencies) {
      heap.insert(+frequencies[c], c);
    }
    while (heap.size() > 1) {
      const {key: p1, value: a} = heap.removeRoot();
      const {key: p2, value: b} = heap.getRoot();
      heap.replaceRoot(p1 + p2, [a, b]);
    }
    return heap.getRoot().value;
  };

  huffman.code = (r, prefix = '') => {
    if (!r || r.constructor !== Array || r.length !== 2) return [[r, prefix || '0']];
    return [].concat(huffman.code(r[0], prefix + '0'), huffman.code(r[1], prefix + '1'));
  };

  return huffman;
})();

const ui = ($ => {
  const dom = {
    source: $('#source'),
    tree: $('#tree'),
    code: $('#code'),
    bytes: $('#bytes'),
    error: $('#error'),
    stats: $('#stats'),
  };

  const error = e => {
    dom.error.innerText = e || '';
    dom.error.style.display = (dom.error.innerText) ? 'block' : 'none';
  };

  const writeBits = bits => util
    .getChunks(16, Array.from(bits))
    .map(x => parseInt(x.join(''), 2).toString(16).padStart(4, '0'))
    .join(' ');

  const readBits = input => [].concat(...
    Array.from(input.toLowerCase().replace(/[^0-9a-f]/g, ''))
      .map(x => Array.from(parseInt(x, 16).toString(2).padStart(4, '0')))
  );

  const update = {
    encode: () => {
      try {
        error();
        const input = dom.source.value;
        const tree = input && huffman(input);
        dom.code.innerHTML = huffman.code(tree).map(x => `<tr>${x.map(y => `<td>${y}</td>`).join('')}</tr>`).join('\n');
        dom.tree.value = input && JSON.stringify(tree);
        const bits = huffman.encode(tree, input);
        dom.stats.innerText = stats(input.length, bits.length);
        dom.bytes.value = input && writeBits(bits.padEnd(Math.ceil(bits.length/16)*16, '0'));
      }
      catch (e) {
        error(e);
      }
    },
    decode: () => {
      try {
        error();
        const tree = JSON.parse(dom.tree.value);
        dom.code.innerHTML = huffman.code(tree).map(x => `<tr>${x.map(y => `<td>${y}</td>`)}</tr>`).join('\n');
        const bits = readBits(dom.bytes.value);
        dom.source.value = huffman.decode(tree, bits);
        dom.stats.innerText = stats(dom.source.value.length, bits.length);
      }
      catch (e) {
        error(e);
      }
    },
  };

  const stats = (input, bits) => `Compressed ${input*8} bits to ${bits}, or ${Math.round((input*8 - bits)/input/8 * 100)}%.`;
  dom.source.oninput = update.encode;
  dom.tree.oninput = dom.bytes.oninput = update.decode;

})(document.querySelector.bind(document));
