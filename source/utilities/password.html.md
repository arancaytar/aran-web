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
<input id="delimiter" type="text" value=" " size="1">
<label for="delimiter">Delimiter</label>
<button id="regenerate" type="button" title="Regenerate"><i class="fas fa-sync-alt"></i></button>

</fieldset>

<div id="output" class="box code" style="text-align: center; font-size: 1.5em"></div>

## Information

<div id="stats"></div>

Word list provided by [Word frequency data](https://www.wordfrequency.info).

Note: Many systems use incompetently written password authentication, and
therefore do not allow passwords to contain spaces (or, in some exceptionally
egregious cases, require mixed case, numbers, special characters or even
restrict the maximum length).

My suggestion for the first problem is to set the delimiter to some other
character (like `.` or `-`, which also takes care of the fourth problem), for
the second to capitalize the first letter of each word (an easily memorable
rule), for the third or fourth to simply append `1!` (pronounced "FU"), and for
the fifth to completely refuse to use that system if at all possible.

In all five cases, it is also my suggestion to teach good programming to
whomever is in charge of building or maintaining that system.
