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
    const trimmed = string.replace(/\s+/g, '');
    const padding = trimmed.match(/=*$/)[0].length;
    return _.chain(string)
      .replace(/=/g, 'A')
      .chunk(4)
      .map((chunk, i) => {
        try {
          const codes = Array.from(chunk).map(decodeChar64);
          return [
            (codes[0] << 2) | (codes[1] >> 4),
            ((codes[1] & 0xf) << 4) | (codes[2] >> 2),
            ((codes[2] & 0x3) << 6) | codes[3],
          ];
        }
        catch (e) {
          throw `${e} in block #${4*i}..${4*i+3}`;
        }
      })
      .flatten()
      .dropRight(padding)
      .value();
  };

  const writeBytes64 = bytes => {
    const padding = 3 - ((bytes.length - 1) % 3 + 1);
    return _.chain(bytes)
      .chunk(3)
      .map(([a,b=0,c=0]) => [
        a >> 2,
        ((a & 0x3) << 4) + (b >> 4),
        ((b & 0xf) << 2) + (c >> 6),
        c & 0x3f
      ])
      .flatten()
      .map(x => toBase64[x])
      .dropRight(padding)
      .join('') + _.repeat('=', padding);
  };

  return {
    read: decodeBytes64,
    write: writeBytes64,
  };
})();
