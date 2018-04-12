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

## Entropy

<div id="stats"></div>

The correct metric for the security of a randomly generated password is its
*entropy*, that is, the logarithm of the total pool of possible passwords it
was drawn from.

As [formulated by Auguste Kerckhoff](https://en.wikipedia.org/wiki/Kerckhoffs%27s_principle),
a cryptosystem should be secure if everything but the key is public knowledge.
Likewise, a password should be secure even if the attacker knows your method of
choosing a password. Naive passwords that depend on personal data (names, dates)
trivially fail this challenge, but even an ostensibly *good* password (like `correct
horse battery staple`) are weak if the words are picked by a human, because
humans are bad at generating randomness.

The minimum entropy of your password can be approximated as a sum of several binary logarithms:

* How fast you expect an attacker to guess (`log2(guesses per second)`)
* How long the password must remain secure (`log2(years)`)
* 25 (because there are almost 2<sup>25</sup> seconds in a year).
* How unlikely it should be for the attacker to guess correctly (`log2(1/p)`).

For example, if I want an attacker who can guess a thousand times per second
to have no more than a one in a thousand chance of guessing correctly in 8 years,
I would add `10 + 10 + 25 + 3` to get a minimum entropy of 48 bits.

Note: Do not focus obsessively on the difficulty of brute-forcing. The biggest risk
to your password's security is you. Avoid storing it in clear text, avoid
entering it on devices you do not control, avoid using similar passwords on different
systems (even non-simultaneously). Avoid letting your device get compromised, and
avoid entering your password on imitations of the true system.

## Format

Many systems use incompetently written password authentication, and
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

## Security

This is a client-only utility whose source is available at [password.js](password.js).
For particularly sensitive cases, I would recommend auditing the code and adapting
it to run in a local context to prevent its output from being leaked by browser extensions.

## Credits

Word list provided by [Word frequency data](https://www.wordfrequency.info).
