---
title: Rotation cipher
scripts: ['rotation.js']
---
A [rotation cipher](https://en.wikipedia.org/wiki/Caesar_cipher) substitutes
every letter with one that is a fixed amount of positions after it in the alphabet.

<textarea id="input" placeholder="Input text" rows="5"></textarea>
<fieldset>
  <label for="shift">Shift by</label>
  <input id="shift" type="range" steps="1" min="0" max="25" value="13" />
  <button id="button-rot13" type="button">ROT-13</button>
  <button id="button-guess" type="button">Guess</button>
  <button id="button-invert" type="button">Invert</button>
</fieldset>
<div id="output" class="box code" hidden></div>

As the rotation cipher's key is a single number between 0 and 25, it is trivial
to brute-force. An algorithm can guess the correct offset by comparing the
relative letter frequencies of the output text with those of English.
