const ui = (($, $$) => {
  const dom = {
    input: $('#input'),
    output: $('#output'),
    source: $('#source'),
    source_base: $('#source_base'),
    target: $('#target'),
    target_base: $('#target_base'),
    swap: $('#swap'),
    swap_input: $('#swap_input'),
  };

  const bases = {
    2: 'Binary',
    8: 'Octal',
    10: 'Decimal',
    16: 'Hexadecimal',
    64: 'Base64',
    256: 'PGP word',
  };
  const special_bases = {
    64: base64,
    256: byteword,
  };

  const options = {'raw': 'Raw', 'punycode': 'Punycode'};
  const formats = {};
  formats.raw = {
    decode: string => Array.from(decodeUtf16(_.chain(string).map(char => char.codePointAt()).value())),
    encode: chars => chars.map(char => String.fromCodePoint(char)).join(''),
  };
  formats.codepoints = {
    decode: (string, base) => assertUnicode(stripDown(/[^0-9a-z\s]/g, string.toLowerCase(), false)
      .split(/\s+/)
      .map(char => parseInt(char, base))),
    encode: (chars, base) => chars.map(char => char.toString(base)).join(' '),
  };
  formats.punycode = {
    _adapt: (delta, numpoints, firsttime) => {
      delta = Math.floor(delta / (firsttime ? 700 : 2));
      delta += Math.floor(delta / numpoints);
      // (base - tmin) * tmax div 2 === (36 - 1) * 26 div 2 === 35 * 13 === 455
      let k = 0;
      while (delta > 455) {
        delta = Math.floor(delta / 35);
        k += 36
      }
      return k + Math.floor(36 * delta / (delta + 38));
    },

    /**
     * @param {string} string
     */
    decode: string => {
      const delim = string.lastIndexOf('-');
      let output = Array.from(decodeUtf16(_.chain(string.substring(0, delim)).map(char => char.charCodeAt())));
      for (let i in output) {
        if (output[i] > 0x7f) throw `Non-ASCII character at #${i}: ${String.fromCodePoint(output[i])}`;
      }
      let extension = Array.from(_.chain(string.substring(delim+1).toLowerCase()).map(x => x.charCodeAt()));

      let n = 128, i = 0, bias = 72, w = 1, k = 36, old_i = 0;

      for (let digit of extension) {
        const value = digit - ((digit > 96) ? 97 : 22);
        if (value < 0 || value > 35) throw `Invalid digit: ${String.fromCodePoint(digit)} = ${value}`;
        i += value * w;
        const t = Math.min(26, Math.max(1, k - bias));
        if (value < t) {
          const l = output.length + 1;
          bias = formats.punycode._adapt(i - old_i, l, old_i === 0);
          n += Math.floor(i / l);
          i %= l;
          output.splice(i, 0, n);
          k = 36;
          i += 1;
          w = 1;
          old_i = i;
        }
        else {
          w *= 36 - t;
          k += 36
        }
      }
      return output;
    },

    /**
     * @param {number[]} chars
     */
    encode: chars => {
      let sorted = chars.filter(a => a >= 128).sort((a, b) => Math.sign(a - b));
      const findmin = () => {
        let target = sorted[0];
        let i = 0;
        for (let c of sorted) {
          if (c > target) break;
          else i++;
        }
        sorted = sorted.slice(i);
        return target;
      }
      const digit = i => String.fromCodePoint(i + (i <= 25 ? 97 : 22));

      let n = 128, delta = 0, i = 0, bias = 72;
      let output = chars.filter(x => x < 128).map(c => String.fromCodePoint(c)).join("");
      let h = output.length, b = h;
      if (output.length) output += '-';
      while (h < chars.length) {
        let m = findmin();
        delta += (m - n) * (h + 1);
        n = m;
        for (let c of chars) {
          if (c < n) delta++;
          else if (c === n) {
            let q = delta;
            for (let k = 36 ;; k += 36) {
              const t = Math.min(26, Math.max(1, k - bias));
              if (q < t) break;
              output += digit(t + (q - t) % (36 - t));
              q = Math.floor((q - t) / (36 - t));
            }
            output += digit(q);
            bias = formats.punycode._adapt(delta, h + 1, h === b);
            delta = 0;
            h++;
          }
        }
        n++;
        delta++;
      }
      return output;
    },
  };

  const assertUnicode = chars => {
    const badChars = chars.filter(char => char < 0 || char > 0x10ffff);
    if (badChars[0]) throw `Bad codepoint 0x${badChars[0].toString(16)}`;
    return chars;
  };

  const encodings = {
    utf8: 'UTF-8',
    utf16: 'UTF-16',
    utf32: 'UTF-32 / UCS-4',
    codepoints: 'Codepoints',
  };
  for (let encoding in encodings) options[encoding] = `${encodings[encoding]}`;

  const decode = (input, encoding, base) =>
    formats[encoding] ?
      formats[encoding].decode(input, base) :
      readChars[encoding](assertBytes(readBytes[base](input)));
  const encode = (input, encoding, base) =>
    formats[encoding] ? formats[encoding].encode(input, base) :
      writeBytes[base](toBytes[encoding](input));

  const readBytes = [];
  const stripDown = (bad, s, spaces=true) => {
    const stripped = spaces ? s.replace(/\s+/g, '') : s;
    const x = stripped.match(bad);
    if (x) throw `Bad character ${x[0]}`;
    return stripped;
  };

  const assertBytes = bytes => {
    const badBytes = bytes.filter(byte => byte < 0 || byte > 255);
    if (badBytes[0]) throw `Bad byte 0x${badBytes[0].toString(16)}`;
    return bytes;
  };

  const decodeUtf16 = function*(chars) {
    let high = null;
    for (let char of chars) {
      if (0xd800 <= char && char < 0xdc00) {
        if (high != null) throw `Invalid surrogate pair ${high} ${char}.`;
        high = char;
      }
      else if (0xdc00 <= char && char < 0xe000) {
        if (high == null) throw `Invalid low surrogate ${char}.`;
        yield ((high & 0x3ff) << 10) | (char & 0x3ff) | 0x10000;
        high = null;
      }
      else if (high) throw `Invalid high surrogate ${char}.`;
      else yield char;
    }
  };

  readBytes[2] = input => _.chain(stripDown(/[^01]/g, input))
    .chunk(8)
    .map(s => parseInt(s.join(''), 2))
    .value();
  readBytes[8] = input => _.chain(stripDown(/[^0-7]/g, input))
    .chunk(3)
    .map(s => parseInt(s.join(''), 8))
    .value();
  readBytes[10] = input => stripDown(/[^0-9\s]/g, input, false)
    .split(/\s+/)
    .map(s => parseInt(s));
  readBytes[16] = input => _.chain(stripDown(/[^0-9a-f]/g, input.toLowerCase()))
    .chunk(2)
    .map(s => parseInt(s.join(''), 16))
    .value();
  readBytes[64] = base64.read;
  readBytes[256] = byteword.read;

  const readChars = {};
  readChars.utf8 = bytes => {
    const assert = (...j) => j.forEach(i => {
      if (bytes[i] === undefined) throw `Incomplete byte sequence at end of input.`;
      if (bytes[i] & 192 ^ 128) throw `Bad byte ${bytes[i].toString(16)} at #${i}.`;
    });
    const chars = [];
    let i = 0;
    while (i < bytes.length) {
      if (bytes[i] < 0x7f) {
        chars.push(bytes[i++]);
      }
      else if (bytes[i] < 0xe0) {
        assert(i+1);
        chars.push(
          ((bytes[i++] & 0x1f) << 6) |
          (bytes[i++] & 0x3f)
        );
      }
      else if (bytes[i] < 0xf0) {
        assert(i+1, i+2);
        chars.push(
          ((bytes[i++] & 0xf) << 12) |
          ((bytes[i++] & 0x3f) << 6) |
          (bytes[i++] & 0x3f)
        );
      }
      else {
        assert(i + 1, i + 2, i + 3);
        chars.push(
          ((bytes[i++] & 0x7) << 18) |
          ((bytes[i++] & 0x3f) << 12) |
          ((bytes[i++] & 0x3f) << 6) |
          (bytes[i++] & 0x3f)
        );
      }
    }
    return chars;
  };

  readChars.utf16 = bytes => {
    const bytes2 = _.chain(bytes)
      .chunk(2)
      .map(([a,b]) => a << 8 | b)
      .value();
    const chars = [];
    for (let i = 0; i < bytes2.length; ++i) {
      if (bytes2[i] >= 0xd800 && bytes2[i] < 0xdc00 && bytes2[i+1] >= 0xdc00 && bytes2[i+1] < 0xe000) {
        const high = bytes2[i] & 0x3ff;
        const low = bytes2[++i] & 0x3ff;
        chars.push(((high << 10) | low) + 0x10000);
      }
      else {
        chars.push(bytes2[i]);
      }
    }
    return chars;
  };
  readChars.utf32 = bytes => _.chain(bytes)
    .chunk(4)
    .map(([a,b=0,c=0,d=0]) => (a << 24) + (b << 16) + (c << 8) + d)
    .value();

  const writeBytes = [];
  const l = {2: 8, 8: 3, 10: 1, 16: 2};
  for (let i of [2, 8, 10, 16]) writeBytes[i] = s => _.chain(s)
    .map(b => b.toString(i).padStart(l[i], '0'))
    .join(' ')
    .value();
  writeBytes[64] = base64.write;
  writeBytes[256] = byteword.write;

  const toBytes = {};
  toBytes.utf8 = chars => _.chain(chars)
    .map(char =>
        (char < 0x7f) ? [char]
      : (char < 0x800) ? [0xc0 | (char >> 6), 0x80 | (0x3f & char)]
      : (char < 0x10000) ? [
          0xe0 | (char >> 12),
          0x80 | (0x3f & (char >> 6)),
          0x80 | (0x3f & char)
        ]
      :
        [
          0xf0 | (char >> 18),
          0x80 | (0x3f & (char >> 12)),
          0x80 | (0x3f & (char >> 6)),
          0x80 | (0x3f & char)
        ]
    )
    .flatten()
    .value();
  toBytes.utf16 = chars => _.chain(chars)
    .map(char => {
      if (char < 0x10000) return [char >> 8, char & 0xff];

      const char2 = char - 0x10000;
      const high = (char2 >> 10) | 0xd800;
      const low = (char2 & 0x3ff) | 0xdc00;
      return [
        high >> 8, high & 0xff,
        low >> 8, low & 0xff
      ];
    })
    .flatten()
    .value();
  toBytes.utf32 = chars => _.chain(chars)
    .map(char => [
      char >> 24,
      (char >> 16) & 0xff,
      (char >> 8) & 0xff,
      char & 0xff
    ])
    .flatten()
    .value();

  for (let option in options) {
    const html = `<option value="${option}">${options[option]}</option>`;
    dom.source.insertAdjacentHTML('beforeend', html);
    dom.target.insertAdjacentHTML('beforeend', html);
  }
  for (let base in bases) {
    const html = `<option value="${base}"${base==16 ? ' selected="selected"' : ""}>${bases[base]}</option>`;
    dom.source_base.insertAdjacentHTML('beforeend', html);
    dom.target_base.insertAdjacentHTML('beforeend', html);
  }

  const run = () => {
    const source = dom.source.value;
    const target = dom.target.value;
    const input = dom.input.value.trim();
    if (!input) return dom.output.innerText = '';
    try {
      const raw = decode(input, source, dom.source_base.value);
      const output = encode(raw, target, dom.target_base.value);
      dom.output.innerText = output;
    }
    catch (e) {
      dom.output.innerHTML = `<span class="error">${e}</span>`;
    }
  };

  const updateOptions = () => {
    dom.source_base.style.display = (dom.source.value in encodings) ? '' : 'none';
    dom.target_base.style.display = (dom.target.value in encodings) ? '' : 'none';
    Array.from($$('option[value="64"],option[value="256"]')).forEach(e => {
      e.disabled = e.parentElement.previousElementSibling.value === 'codepoints';
    });
    run();
  };

  dom.source.oninput = dom.target.oninput = updateOptions;
  dom.source_base.oninput =  dom.target_base.oninput = dom.input.oninput = run;
  dom.swap.onclick = () => {
    [dom.source.value, dom.source_base.value, dom.target.value, dom.target_base.value, dom.input.value] =
      [dom.target.value, dom.target_base.value, dom.source.value, dom.source_base.value, dom.output.innerText];
    updateOptions();
  };
  dom.swap_input.onclick = () => {
    dom.input.value = dom.output.innerText;
    run();
  };

  updateOptions();

  return {dom, run, encode, decode, readBytes, writeBytes};
})(
  document.querySelector.bind(document),
  document.querySelectorAll.bind(document),
);
