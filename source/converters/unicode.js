const ui = ($ => {
  const dom = {
    input: $('#input'),
    output: $('#output'),
    source: $('#source'),
    target: $('#target')
  };

  const options = {'raw': 'Raw', 'u16': 'Unicode (hex, space-separated)'};
  const formats = {};
  formats.raw = {decode: a => a, encode: a => a};
  formats.u16 = {
    decode: a => stripDown(/[^0-9a-f\s]/g, a.toLowerCase(), false).split(/\s+/)
      .map(s => String.fromCharCode(parseInt(s, 16)))
      .join(''),
    encode: a => Array.from(a).map(s => s.charCodeAt().toString(16)).join(' ')
  };

  const bases = {
    2: 'Binary',
    8: 'Octal',
    10: 'Decimal',
    16: 'Hexadecimal',
    64: 'Base64'
  };
  const encodings = {'utf8': 'UTF-8', 'utf16': 'UTF-16', 'utf32': 'UTF-32 / UCS-4'};

  for (let encoding in encodings) {
    for (let base in bases) {
      const name = `${encoding}-${base}`;
      formats[name] = {base, encoding};
      options[name] = `${encodings[encoding]} (${bases[base]})`;
    }
  }

  const getChunks = (k, sequence) => {
    if (0 !== sequence.length % k) throw `Input length must be a multiple of ${k}.`;
    const chunks = [];
    for (let i = 0; i < sequence.length; i += k) {
      chunks.push(sequence.slice(i, i+k));
    }
    return chunks;
  }

  const decodeBytes = (base, encoding, input) =>
    readChars[encoding](readBytes[base](input));
  const decode = (source, input) =>
    formats[source].base ? decodeBytes(formats[source].base, formats[source].encoding, input)
                         : formats[source].decode(input);

  const readBytes = [];
  const stripDown = (bad, s, spaces=true) => {
    const stripped = spaces ? s.replace(/\s+/g, '') : s;
    const x = stripped.match(bad);
    if (x) throw `Bad character ${x[0]}`;
    return stripped;
  }
  readBytes[2] = input => getChunks(8, stripDown(/[^01]/g, input)).map(s => parseInt(s, 2));
  readBytes[8] = input => getChunks(3, stripDown(/[^0-7]/g, input)).map(s => parseInt(s, 8));
  readBytes[10] = input => stripDown(/[^0-9\s]/g, input, false).split(/\s+/).map(s => parseInt(s));
  readBytes[16] = input => getChunks(2, stripDown(/[^0-9a-f]/g, input.toLowerCase())).map(s => parseInt(s, 16));

  const fromBase64 = {};
  const toBase64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (let c = 0; c < 64; c++) fromBase64[toBase64[c]] = c;

  const decodeChar64 = char => {
    const x = fromBase64[char];
    if (x !== undefined) return x;
    throw `Invalid character ${char}`;
  }
  readBytes[64] = string => {
    const bytes = [];
    const padding = string.match(/=*$/)[0].length;
    string = string.replace(/=/g, 'A');
    const chunks = getChunks(4, string);
    for (let i = 0; i < chunks.length; i++) {
      try {
        const codes = Array.from(chunks[i]).map(decodeChar64);
        bytes.push(
          (codes[0] << 2) | (codes[1] >> 4),
          ((codes[1] & 0xf) << 4) | (codes[2] >> 2),
          ((codes[2] & 0x3) << 6) | codes[3]
        );
      }
      catch (e) {
        throw `${e} in block #${4*i}..${4*i+3}`;
      }
    }
    return bytes.slice(0, bytes.length - padding);
  }

  const readChars = {};
  readChars.utf8 = bytes => {
    const assert = i => {
      if (bytes[i] & 192 !== 128) throw `Bad byte ${bytes[i].toString(16)} at #${i}`;
    }
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
    const bytes2 = getChunks(2, bytes).map(([a,b]) => a << 8 | b);
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
  }
  readChars.utf32 = bytes => getChunks(4, bytes)
    .map(([a,b,c,d]) => (a << 24) | (b << 16) | (c << 8) | d)
    .map(s => String.fromCharCode(s))
    .join('')

  const encodeBytes = (base, encoding, input) =>
    writeBytes[base](toBytes[encoding](input))
  const encode = (target, input) =>
    formats[target].base ? encodeBytes(formats[target].base, formats[target].encoding, input)
      : formats[target].encode(input);

  const writeBytes = [];
  const l = {2: 8, 8: 3, 10: 1, 16: 2};
  for (let i of [2, 8, 10, 16]) writeBytes[i] = s => s.map(b => b.toString(i).padStart(l[i], '0')).join(' ');
  writeBytes[64] = bytes => {
    let output = "";
    const padding = 3 - (bytes.length % 3);
    bytes.push(...Array(padding).fill(0));
    const chunks = getChunks(3, bytes);
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const code = (chunk[0] << 16) | (chunk[1] << 8) | chunk[2];
      output += toBase64[code >> 18]
       + toBase64[(code >> 12) & 0x3f]
       + toBase64[(code >> 6) & 0x3f]
       + toBase64[code & 0x3f];
    }
    return output.slice(0, output.length - padding) + Array(padding).fill('=').join('');
  }

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
  }
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
  }
  toBytes.utf32 = string => {
    const bytes = [];
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      bytes.push(char >> 24, (char >> 16) & 0xff, (char >> 8) & 0xff, char & 0xff);
    }
    return bytes;
  }


  for (let option in options) {
    const html = `<option value="${option}">${options[option]}</option>`;
    dom.source.insertAdjacentHTML('beforeend', html);
    dom.target.insertAdjacentHTML('beforeend', html);
  }

  const run = () => {
    const source = dom.source.value;
    const target = dom.target.value;
    const input = dom.input.value;
    try {
      const raw = decode(source, input);
      const output = encode(target, raw);
      dom.output.innerText = output;
    }
    catch (e) {
      dom.output.innerHTML = `<span class="error">${e}</span>`;
    }
  }

  dom.source.oninput = dom.target.oninput = dom.input.oninput = run;

  return {dom, run, encode, decode, readBytes, writeBytes};
})(
  document.querySelector.bind(document),
);
