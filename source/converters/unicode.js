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

  const options = {'raw': 'Raw'};
  const formats = {};
  formats.raw = {
    decode: string => Array.from(string).map(char => char.codePointAt()),
    encode: chars => chars.map(char => String.fromCodePoint(char)).join(''),
  };
  formats.codepoints = {
    decode: (string, base) => assertUnicode(stripDown(/[^0-9a-z\s]/g, string.toLowerCase(), false)
      .split(/\s+/)
      .map(char => parseInt(char, base))),
    encode: (chars, base) => chars.map(char => char.toString(base)).join(' '),
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

  readBytes[2] = input => util.getChunks(8, stripDown(/[^01]/g, input)).map(s => parseInt(s, 2));
  readBytes[8] = input => util.getChunks(3, stripDown(/[^0-7]/g, input)).map(s => parseInt(s, 8));
  readBytes[10] = input => stripDown(/[^0-9\s]/g, input, false).split(/\s+/).map(s => parseInt(s));
  readBytes[16] = input => util.getChunks(2, stripDown(/[^0-9a-f]/g, input.toLowerCase())).map(s => parseInt(s, 16));
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
    const bytes2 = util.getChunks(2, bytes).map(([a,b]) => a << 8 | b);
    let i = 0;
    const chars = [];
    while (i < bytes2.length) {
      if (bytes2[i] < 0xd800 || bytes2[i] >= 0xe000) {
        chars.push(bytes2[i++]);
      }
      else {
        if (bytes2[i+1] === undefined) throw `Incomplete surrogate pair at end of input.`;
        if (bytes2[i] > 0xdbff) throw `Bad byte sequence ${bytes[i].toString(16)} at #${2*i}`;
        const high = bytes[i++] & 0x3ff;
        const low = bytes[i++] & 0x3ff;
        chars.push((high << 10) | low);
      }
    }
    return chars;
  };
  readChars.utf32 = bytes => util.getChunks(4, bytes)
    .map(([a,b,c,d]) => (a << 24) + (b << 16) + (c << 8) + d);

  const writeBytes = [];
  const l = {2: 8, 8: 3, 10: 1, 16: 2};
  for (let i of [2, 8, 10, 16]) writeBytes[i] = s => s.map(b => b.toString(i).padStart(l[i], '0')).join(' ');
  writeBytes[64] = base64.write;
  writeBytes[256] = byteword.write;

  const toBytes = {};
  toBytes.utf8 = chars => [].concat(...
    chars.map(char =>
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
  );
  toBytes.utf16 = chars => [].concat(...
    chars.map(char => {
      if (char < 0xd800 || char >= 0xe000) {
        return [char >> 8, char & 0xff];
      }
      else {
        const high = (char >> 10) | 0xd800;
        const low = (char >> 10) | 0xdc00;
        return [
          high >> 8, high & 0xff,
          low >> 8, low & 0xff
        ];
      }
    })
  );
  toBytes.utf32 = chars => [].concat(...
    chars.map(char => [
      char >> 24,
      (char >> 16) & 0xff,
      (char >> 8) & 0xff,
      char & 0xff
    ])
  );

  for (let option in options) {
    const html = `<option value="${option}">${options[option]}</option>`;
    dom.source.insertAdjacentHTML('beforeend', html);
    dom.target.insertAdjacentHTML('beforeend', html);
  }
  for (let base in bases) {
    const html = `<option value="${base}">${bases[base]}</option>`;
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
