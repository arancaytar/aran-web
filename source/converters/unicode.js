const ui = ($ => {
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
    64: {read: atob, write: btoa},
    256: {
      read: byteword.readByte,
      write: byteword.writeByte,
    }
  };

  const options = {'raw': 'Raw'};
  const formats = {};
  formats.raw = {decode: a => a, encode: a => a};
  formats.charcodes = {
    decode: (a, base) => stripDown(/[^0-9a-f\s]/g, a.toLowerCase(), false).split(/\s+/)
      .map(
        base < 64 ? s => String.fromCharCode(parseInt(s, base)) : special_bases[base].read
      )
      .join(''),
    encode: (a, base) => Array.from(a).map(
      base < 64 ? s => s.charCodeAt().toString(base) : special_bases[base].write
    ).join(' ')
  };

  const encodings = {'utf8': 'UTF-8', 'utf16': 'UTF-16', 'utf32': 'UTF-32 / UCS-4', 'charcodes': 'Charcodes'};
  for (let encoding in encodings) options[encoding] = `${encodings[encoding]}`;

  const decode = (input, encoding, base) =>
    formats[encoding] ?
      formats[encoding].decode(input, base) :
      readChars[encoding](readBytes[base](input));

  const readBytes = [];
  const stripDown = (bad, s, spaces=true) => {
    const stripped = spaces ? s.replace(/\s+/g, '') : s;
    const x = stripped.match(bad);
    if (x) throw `Bad character ${x[0]}`;
    return stripped;
  };

  readBytes[2] = input => util.getChunks(8, stripDown(/[^01]/g, input)).map(s => parseInt(s, 2));
  readBytes[8] = input => util.getChunks(3, stripDown(/[^0-7]/g, input)).map(s => parseInt(s, 8));
  readBytes[10] = input => stripDown(/[^0-9\s]/g, input, false).split(/\s+/).map(s => parseInt(s));
  readBytes[16] = input => util.getChunks(2, stripDown(/[^0-9a-f]/g, input.toLowerCase())).map(s => parseInt(s, 16));
  readBytes[256] = input => input.toLowerCase().split(/\s+/).map(special_bases[256].read).map(s => s.charCodeAt());

  const fromBase64 = {};
  const toBase64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (let c = 0; c < 64; c++) fromBase64[toBase64[c]] = c;

  const decodeChar64 = char => {
    const x = fromBase64[char];
    if (x !== undefined) return x;
    throw `Invalid character ${char}`;
  };
  readBytes[64] = base64.read;

  const readChars = {};
  readChars.utf8 = bytes => {
    const assert = i => {
      if (bytes[i] & 192 !== 128) throw `Bad byte ${bytes[i].toString(16)} at #${i}`;
    };
    let i = 0;
    let output = '';
    while (i < bytes.length) {
      if (bytes[i] < 0x7f) {
        output += String.fromCharCode(bytes[i++]);
      }
      else if (bytes[i] < 0xe0) {
        assert(i+1);
        const code = ((bytes[i++] & 0x1f) << 6)
         | (bytes[i++] & 0x3f);
        output += String.fromCharCode(code);
      }
      else if (bytes[i] < 0xf0) {
        assert(i+1, i+2);
        const code = ((bytes[i++] & 0xf) << 12)
         | ((bytes[i++] & 0x3f) << 6)
         | (bytes[i++] & 0x3f);
         output += String.fromCharCode(code);
      }
      else {
        assert(i, i+2, i+3);
        const code = ((bytes[i++] & 0x7) << 24)
         | ((bytes[i++] & 0x3f) << 18)
         | ((bytes[i++] & 0x3f) << 12)
         | ((bytes[i++] & 0x3f) << 6)
        output += String.fromCharCode(code);
      }
    }
    return output;
  };

  readChars.utf16 = bytes => {
    const bytes2 = util.getChunks(2, bytes).map(([a,b]) => a << 8 | b);
    let i = 0;
    let output = '';
    while (i < bytes2.length) {
      if (bytes2[i] < 0xd800 || bytes2[i] >= 0xe000) {
        output += String.fromCharCode(bytes2[i++]);
      }
      else {
        if (bytes2[i] > 0xdbff) throw `Bad byte sequence ${bytes[i].toString(16)} at #${2*i}`;
        const high = bytes[i++] & 0x3ff;
        const low = bytes[i++] & 0x3ff;
        output += String.fromCharCode((high << 10) | low);
      }
    }
    return output;
  };

  readChars.utf32 = bytes => util.getChunks(4, bytes)
    .map(([a,b,c,d]) => (a << 24) | (b << 16) | (c << 8) | d)
    .map(s => String.fromCharCode(s))
    .join('');

  const encode = (input, encoding, base) =>
    formats[encoding] ? formats[encoding].encode(input, base) :
      writeBytes[base](toBytes[encoding](input));

  const writeBytes = [];
  const l = {2: 8, 8: 3, 10: 1, 16: 2};
  for (let i of [2, 8, 10, 16]) writeBytes[i] = s => s.map(b => b.toString(i).padStart(l[i], '0')).join(' ');
  writeBytes[64] = base64.write;
  writeBytes[256] = bytes => bytes.map(String.fromCharCode).map(special_bases[256].write).join(' ');

  const toBytes = {};
  toBytes.utf8 = string => {
    const bytes = [];
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      if (char < 0x7f) {
        bytes.push(char);
      }
      else if (char < 0x800) {
        bytes.push(0xc0 | (char >> 6), 0x80 | (0x3f & char));
      }
      else if (char < 0x10000) {
        bytes.push(
          0xe0 | (char >> 12),
          0x80 | (0x3f & (char >> 6)),
          0x80 | (0x3f & char)
        )
      }
      else {
        bytes.push(
          0xf0 | (char >> 18),
          0x80 | (0x3f & (char >> 12)),
          0x80 | (0x3f & (char >> 6)),
          0x80 | (0x3f & char)
        )
      }
    }
    return bytes;
  };
  toBytes.utf16 = string => {
    const bytes = [];
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      if (char < 0xd800 || char >= 0xe000) {
        bytes.push(char >> 8, char & 0xff);
      }
      else {
        const high = (char >> 10) | 0xd800;
        const low = (char >> 10) | 0xdc00;
        bytes.push(
          high >> 8, high & 0xff,
          low >> 8, low & 0xff
        );
      }
    }
    return bytes;
  };
  toBytes.utf32 = string => {
    const bytes = [];
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      bytes.push(char >> 24, (char >> 16) & 0xff, (char >> 8) & 0xff, char & 0xff);
    }
    return bytes;
  };

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
    dom.source_base.style.visibility = (source in encodings) ? 'visible' : 'hidden';
    const target = dom.target.value;
    dom.target_base.style.visibility = (target in encodings) ? 'visible' : 'hidden';
    const input = dom.input.value;
    try {
      const raw = decode(input, source, dom.source_base.value);
      const output = encode(raw, target, dom.target_base.value);
      dom.output.innerText = output;
    }
    catch (e) {
      dom.output.innerHTML = `<span class="error">${e}</span>`;
    }
  };

  dom.source.oninput = dom.source_base.oninput = dom.target.oninput = dom.target_base.oninput = dom.input.oninput = run;
  dom.swap.onclick = () => {
    [dom.source.value, dom.source_base.value, dom.target.value, dom.target_base.value, dom.input.value] =
      [dom.target.value, dom.target_base.value, dom.source.value, dom.source_base.value, dom.output.innerText];
    run();
  };
  dom.swap_input.onclick = () => {
    dom.input.value = dom.output.innerText;
    run();
  };

  run();

  return {dom, run, encode, decode, readBytes, writeBytes};
})(
  document.querySelector.bind(document),
);
