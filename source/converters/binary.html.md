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

## Supported representations

Bytes can be represented in binary, octal, decimal or hexadecimal bases. The binary,
octal and hexadecimal bytes are padded to a fixed length (8, 3 and 2 digits
per byte); the decimal presentation is variable-length and space-separated.

The [Base64](https://en.wikipedia.org/wiki/Base64) encoding is a special case
for rendering byte sequences as printable alphanumeric characters (plus the characters
  `/`, `+` and `=`).

The [PGP word list](https://en.wikipedia.org/wiki/PGP_word_list) encodes bytes as a sequence
of words, and is useful for conveying data over an audio channel.

The ASCII format prints the data as a string, in which non-printable bytes are escaped as
`\x00 ... \xff`, and backslashes are escaped as `\\`.

This converter does not support multi-byte characters. Use the [unicode converter](/converters/unicode)
to work with text.

## Raw formats

Beside representing the byte values, this converter can also provide the raw data in the form
of a hyperlink or an image element. A [Media type](https://en.wikipedia.org/wiki/Media_type) identifier may optionally be entered.
Note: Some browsers prevent left-clicking on data links for security reasons. If the link does not seem to work,
use the context menu to either save or open it in a new tab.
