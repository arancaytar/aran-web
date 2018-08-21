const ui = (($, base64) => {
  const dom = {
    input: $('#input'),
    output: $('#output'),
    source: $('#source'),
    target: $('#target'),
    type: $('#type'),
  };

  const printable_ascii = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ \t\n\r\x0b\x0c';
  const is_printable = [];
  for (let i in printable_ascii) {
    is_printable[printable_ascii[i].charCodeAt()] = true;
  }

  const representations = {
    ascii: {
      label: 'ASCII',
      read: s => Array.from(
        s.replace(/\\([0-9a-fA-F]{2})/g, (_, p) => String.fromCharCode(parseInt(p, 16)))
          .replace('\\\\', '\\')
      ).map(s => s.charCodeAt()),
      write: b => b.map(b =>
        is_printable[b] ? String.fromCharCode(b).replace('\\', '\\\\') : `\\${b.toString(16).padStart(2, '0')}`
      ).join(''),
    },
    binary: {
      label: 'Binary',
      read: s => util.getChunks(8, s.replace(/[^01]/g, '')).map(s => parseInt(s, 2)),
      write: b => b.map(b => b.toString(2).padStart(8, '0')).join(' '),
    },
    octal: {
      label: 'Octal',
      read: s => util.getChunks(3, s.replace(/[^0-7]/g, '')).map(s => parseInt(s, 8)),
      write: b => b.map(b => b.toString(8).padStart(3, '0')).join(' '),
    },
    decimal: {
      label: 'Decimal',
      read: s => s.replace(/[^0-9\s]/g, '').split(/\s+/).map(s => parseInt(s)),
      write: b => b.map(b => b.toString()).join(' '),
    },
    hexadecimal: {
      label: 'Hexadecimal',
      read: s => util.getChunks(2, s.toLowerCase().replace(/[^0-9a-f]/g, '')).map(s => parseInt(s, 16)),
      write: b => b.map(b => b.toString(16).padStart(2, '0')).join(' ').replace(/(..) (..)/g, '$1$2'),
    },
    base64: {
      label: 'Base64',
      read: base64.read,
      write: base64.write,
    },
    pgp: {
      label: 'PGP words',
      read: byteword.read,
      write: byteword.write,
    },
    link: {
      label: 'data: Link',
      write: (b, {type}) => {
        const a = link(writeDataURL(b, type));
        a.innerText = 'Link';
        return a;
      }
    },
    image: {
      label: 'data: Image',
      write: (b, {type}) => {
        const url = writeDataURL(b, type);
        const a = link(url);
        const img = document.createElement('img');
        a.appendChild(img);
        img.setAttribute('src', url);
        return a;
      }
    }
  };

  const link = url => {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', '');
    return a;
  };
  const writeDataURL = (b, type) => `data:${type};base64,` + base64.write(b);

  // Technically, the only reader that can cause this is the decimal one.
  const validate = bytes => {
    const bad = bytes.filter(x => x < 0 || x > 255);
    if (bad.length) throw `Invalid byte value ${bad[0]}`;
    return bytes;
  };

  const convert = (input, source, target, opts) =>
    representations[target].write(
      validate(representations[source].read(input, opts)),
      opts
    );

  const run = () => {
    dom.type.style.visibility = (['link', 'image'].includes(dom.target.value)) ? 'visible' : 'hidden';
    try {
      const input = dom.input.value.trim();
      const output = input && convert(input, dom.source.value, dom.target.value, {type: dom.type.value});
      if (output instanceof HTMLElement) {
        dom.output.innerHTML = '';
        dom.output.appendChild(output);
      }
      else dom.output.innerText = output;
    }
    catch (e) {
      dom.output.innerHTML = `<span class="error">${e}</span>`;
    }
  };

  for (let i in representations) {
    const html = `<option value="${i}">${representations[i].label}</option>`;
    if (representations[i].read) dom.source.insertAdjacentHTML('beforeend', html);
    if (representations[i].write) dom.target.insertAdjacentHTML('beforeend', html);
  }

  dom.source.oninput = dom.target.oninput = dom.input.oninput = dom.type.oninput = run;

  run();

  return {dom, run, convert};
})(document.querySelector.bind(document), base64);
