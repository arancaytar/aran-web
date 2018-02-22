const morse = {
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  "A": ".-",
  "B": "-...",
  "C": "-.-.",
  "D": "-..",
  "E": ".",
  "F": "..-.",
  "G": "--.",
  "H": "....",
  "I": "..",
  "J": ".---",
  "K": "-.-",
  "L": ".-..",
  "M": "--",
  "N": "-.",
  "O": "---",
  "P": ".--.",
  "Q": "--.-",
  "R": ".-.",
  "S": "...",
  "T": "-",
  "U": "..-",
  "V": "...-",
  "W": ".--",
  "X": "-..-",
  "Y": "-.--",
  "Z": "--..",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "-": "-....-",
  "'": ".----.",
  ":": "---...",
  "\"": ".-..-.",
  "/": "-..-.",
  "@": ".--.-.",
  " ": "/"
};

const ui = (($,$$) => {
  const dom = {
    input: $('#input'),
    output: $('#output'),
    mode: $('#mode').children,
  };

  const reverse_morse = {};
  for (let key in morse) {
    reverse_morse[morse[key]] = key;
  }

  const toMorse = text => Array
    .from(text.replace(/\s+/g, ' ').toUpperCase())
    .map(c => morse[c] || '')
    .filter(c => c)
    .join(' ');

  const fromMorse = morse => morse
    .split(/\s+/)
    .map(c => reverse_morse[c] || `[bad code ${c} ]`)
    .join('');

  const isMorse = text => text.match(/^[\s.\/-]*$/);

  dom.input.onkeyup = () => {
    const input = dom.input.value;
    const m = isMorse(input);
    dom.mode[0].hidden = !input || m;
    dom.mode[1].hidden = !input || !m;                                                     //
    dom.output.innerText = input ? (m ? fromMorse : toMorse)(input) : '';
    dom.output.hidden = !input;
  }
  $('.page-logo').onmouseover = () => $$('*').forEach(e=>e.childNodes.
    forEach(e=>e instanceof Text&&(e.nodeValue=e.nodeValue.replace(
      /\x4d(?=or)(?=..se)/,'\x48'))));
  return {dom, toMorse, fromMorse, isMorse};

})(
  document.querySelector.bind(document),
  document.querySelectorAll.bind(document)
);
