---
title: Unicode
scripts: ['unicode.js']
---
This is a near-universal converter for various Unicode encodings.

<textarea id="input" rows="5"></textarea>
<label for="source">Source:</label> <select id="source"></select>
<label for="target">Target:</label> <select id="target"></select>
<div id="output" class="box code break"></div>

## Supported formats

### Byte encodings

- [UTF-8](https://en.wikipedia.org/wiki/UTF-8): A variable-length encoding that produces between 1-4 bytes per character.
  Equivalent to ASCII on the ASCII character set.
- [UTF-16](https://en.wikipedia.org/wiki/UTF-16): A variable-length encoding that produces either 2 or 4 bytes per character.
- [UTF-32 / UCS-4](https://en.wikipedia.org/wiki/UTF-32): A fixed-length encoding that produces 4 bytes per character.

### Bases

The bytes can be presented in binary, octal, decimal or hexadecimal bases.
The binary, octal and hexadecimal are padded to a fixed length (8, 3 and 2 digits
per byte); the decimal presentation is space-separated.

The [Base64](https://en.wikipedia.org/wiki/Base64) encoding is a special case
for rendering byte sequences as printable alphanumeric characters (plus the characters
  `/`, `+` and `=`).

### Other formats

The `Raw` format simply prints the string as it should be presented. Note that
most valid code points are either unassigned or do not have a glyph in the
current font; characters may either be missing or presented as a square box.

The `Unicode` format is a space-separated sequence of the code points in hex format.
It's equivalent to UCS-4 aside from replacing the zero-padding with space delimiters.
