---
title: Binary converter
scripts:
  - util.js
  - base64.js
  - byteword.js
  - binary.js
---
This is a converter between various representations of binary data.

<textarea id="input" rows="5"></textarea>
<label for="source">Source:</label> <select id="source"></select>
<label for="target">Target:</label> <select id="target"></select> <input type="text" id="type"/>
<div id="output" class="box code break"></div>

## Formats

Bytes can be represented in binary, octal, decimal or hexadecimal bases. The binary,
octal and hexadecimal representation are padded to a fixed length (8, 3 and 2 digits
per byte); the decimal representation is variable-length and space-separated. These are also
the formats expected for the input. All characters other than the base's digits (and, for decimals,
whitespace delimiters) are ignored.

[Base64](https://en.wikipedia.org/wiki/Base64) is a special encoding that represents byte sequences as
alphanumeric characters (plus the characters `/`, `+` and `=`), using four characters per three bytes.

The [PGP word list](https://en.wikipedia.org/wiki/PGP_word_list) encodes bytes as a sequence
of words, and is useful for conveying data over an audio channel.

The ASCII format prints the data as a string, in which non-printable bytes are escaped as
`\x00 ... \xff`, and backslashes are escaped as `\\`.

This converter works on a byte level. Use the [unicode converter](/converters/unicode) to work with text
that contains multibyte characters.

## Raw output

Beside representing the byte values, this converter can also provide the data in the form
of a hyperlink or an image element with a [Data URI](https://en.wikipedia.org/wiki/Data_URI_scheme).
A [Media type](https://en.wikipedia.org/wiki/Media_type) identifier may optionally be entered.
Note: Some browsers prevent left-clicking on data URI links for security reasons. If the link
does not seem to work, use the context menu to either save or open it in a new tab.
