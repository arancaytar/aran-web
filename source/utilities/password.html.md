---
title: Correct horse
scripts:
  - words.js
  - password.js
---
This generates a passphrase from a specified word list. Passphrases are
demonstrably [more secure and more memorable](https://xkcd.com/936/) than a password
with standard naive attempts at randomization (letter substitutions, numbers,
exclamation marks).

<fieldset>
<label for="length">Length:</label>
<input id="length" type="range" min="2" max="8" value="4" list="marks" />
<label for="length">Count:</label>
<input id="count" type="range" min="1" max="20" value="1" />
<datalist for="length">
  <option value="2" label="2" />
  <option value="4" label="4" />
  <option value="6" label="6" />
  <option value="8" label="8" />
</datalist>
<input id="cap" type="checkbox"><label for="cap">Capitalize</label>
<input id="delimiter" type="text" value=" "><label for="delimiter">Delimiter</label>

</fieldset>

<div id="output" class="box code"></div>

## Information

<div id="stats"></div>

Word list provided by [Word frequency data](https://www.wordfrequency.info).
