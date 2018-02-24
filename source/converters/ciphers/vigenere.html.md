---
title: Vigenére cipher
scripts: ['vigenere.js']
styles:
  - /stylesheets/switch.css
  - lockswitch.css
  - vigenere.css
---
The [Vigenére cipher](https://en.wikipedia.org/wiki/Vigenére cipher) uses a cyclical
sequence of Caesar ciphers, represented by a keyword.

<textarea id="input" placeholder="Input text" rows="5"></textarea>
<fieldset>
  <label for="key">Keyword</label>
  <input id="key" type="text" />
  <input id="direction" type="checkbox" class="switch "/>
  <label for="direction" class="switch"></label>
</fieldset>
<div id="output" class="box code" hidden></div>
