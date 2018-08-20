const base64 = (() => {
  const fromBase64 = {};
  const toBase64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (let c = 0; c < 64; c++) fromBase64[toBase64[c]] = c;

  const decodeChar64 = char => {
    const x = fromBase64[char];
    if (x !== undefined) return x;
    throw `Invalid character ${char}`;
  };

  const decodeBytes64 = string => {
    string = string.replace(/\s+/g, '');
    const bytes = [];
    const padding = string.match(/=*$/)[0].length;
    string = string.replace(/=/g, 'A');
    const chunks = util.getChunks(4, string);
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
  };

  const writeBytes64 = bytes => {
    let output = "";
    const padding = 3 - (bytes.length % 3);
    bytes.push(...Array(padding).fill(0));
    const chunks = util.getChunks(3, bytes);
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const code = (chunk[0] << 16) | (chunk[1] << 8) | chunk[2];
      output += toBase64[code >> 18]
        + toBase64[(code >> 12) & 0x3f]
        + toBase64[(code >> 6) & 0x3f]
        + toBase64[code & 0x3f];
    }
    return output.slice(0, output.length - padding) + Array(padding).fill('=').join('');
  };

  return {
    read: decodeBytes64,
    write: writeBytes64,
  };
})();
