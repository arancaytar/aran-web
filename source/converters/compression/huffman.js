const huffman = (() => {
  const huffman = input => huffman.tree.generate(huffman.countFrequency(input));

  huffman.countFrequency = input => {
    const counts = {};
    Array.from(input).forEach(c => {
      counts[c] = 1 + (counts[c] || 0);
    });
    return counts;
  };

  huffman.code = (r, prefix = '') => {
    if (!r || r.constructor !== Array || r.length !== 2) return [[r, prefix || '0']];
    return [].concat(huffman.code(r[0], prefix + '0'), huffman.code(r[1], prefix + '1'));
  };

  huffman.tree = class {
    constructor(data) {
      this.data = data;
      this.code = _.fromPairs(huffman.code(data));
      this.reverse = _.invert(this.code);
    }

    write(symbol = '~') {
      return this._write(this.data, symbol);
    }

    _write(node, symbol) {
      return (typeof node === 'string') ?
        node.replace('\\', '\\\\').replace(symbol, '\\' + symbol) :
        symbol + this._write(node[0], symbol) + this._write(node[1], symbol);
    }

    static read(string) {
      return new this(this._read(string[0], string)[0]);
    }

    static _read(symbol, string) {
      if (string[0] === symbol) {
        const [a, right] = this._read(symbol, string.substring(1));
        const [b, rest] = this._read(symbol, right);
        return [[a, b], rest];
      }
      if (string[0] === '\\') {
        string = string.substring(1);
      }
      return [string[0], string.substring(1)];
    }

    encode(input) {
      return _.chain(input)
        .map(c => this.code[c])
        .join('')
        .value();
    }

    decode(bits) {
      let n = this.data;
      let j = 0;
      return _.chain(bits)
        .map((bit, i) => {
          const x = n[bit];
          if (x === undefined) throw `Bad sequence ${bits.slice(j, i)} at #${j}.`;
          if (typeof x === 'string') {
            j = i;
            n = this.data;
            return x;
          }
          n = x;
        })
        .compact()
        .join('')
        .value();
    }

    static generate(frequencies) {
      const heap = new Heap();
      for (let c in frequencies) {
        heap.insert(+frequencies[c], c);
      }
      while (heap.size() > 1) {
        const {key: p1, value: a} = heap.removeRoot();
        const {key: p2, value: b} = heap.getRoot();
        heap.replaceRoot(p1 + p2, [a, b]);
      }
      return new this(heap.getRoot().value);
    }
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

  const writeBits = bits => _.chain(bits.length.toString(2).padStart(32, '0') + bits)
    .chunk(16)
    .map(x => parseInt(x.join(''), 2).toString(16).padStart(4, '0'))
    .join(' ')
    .value();

  const readBits = input => {
    const bits = _.chain(input.toLowerCase())
      .replace(/[^0-9a-f]/g, '')
      .map(x => parseInt(x, 16).toString(2).padStart(4, '0'))
      .join('');
    const length = parseInt(bits.take(32).join(''), 2);
    return bits.drop(32).take(length).join('').value();
  };

  const update = {
    encode: () => {
      try {
        error();
        const input = dom.source.value;
        if (!input) return;
        const tree = huffman(input);
        dom.code.innerHTML = _.map(tree.code, (x,y) => `<tr>${[x,y].map(y => `<td>${y}</td>`).join('')}</tr>`).join('\n');
        dom.tree.value = tree.write();
        const bits = tree.encode(input);
        dom.stats.innerText = stats(input.length, bits.length, tree.write().length*8);
        dom.bytes.value = writeBits(bits.padEnd(Math.ceil(bits.length/16)*16, '0'));
      }
      catch (e) {
        error(e);
      }
    },
    decode: () => {
      try {
        error();
        const tree = huffman.tree.read(dom.tree.value);
        dom.code.innerHTML = _.map(tree.code, (x,y) => `<tr>${[x,y].map(y => `<td>${y}</td>`).join('')}</tr>`).join('\n');
        const bits = readBits(dom.bytes.value);
        dom.source.value = tree.decode(bits);
        dom.stats.innerText = stats(dom.source.value.length, bits.length, tree.write().length*8);
      }
      catch (e) {
        error(e);
      }
    },
  };

  const stats = (input, bits, tree) => `Compressed ${input*8} bits to ${bits} + ${tree}, or ${Math.round((input*8 - (bits+tree))/input/8 * 100)}%.`;
  dom.source.oninput = update.encode;
  dom.tree.oninput = dom.bytes.oninput = update.decode;
  return {dom, readBits, writeBits};
})(document.querySelector.bind(document));
