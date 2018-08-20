---
title: Unicode
scripts:
  - util.js
  - base64.js
  - byteword.js
  - unicode.js
---
This is a near-universal converter for various Unicode encodings.

<textarea id="input" rows="5"></textarea>
<label for="source">Source:</label> <select id="source"></select> <select id="source_base"></select>
<button type="button" id="swap" title="Swap source and target formats"><i class="fas fa-exchange-alt"></i></button>
<button type="button" id="swap_input" title="Use output as input"><i class="fas fa-exchange-alt fa-rotate-90"></i></button>
<label for="target">Target:</label> <select id="target"></select> <select id="target_base"></select>
<div id="output" class="box code break"></div>

## Supported formats

### Byte encodings

- [UTF-8](https://en.wikipedia.org/wiki/UTF-8): A variable-length encoding that produces between 1-4 bytes per character.
  Equivalent to ASCII on the ASCII character set.
- [UTF-16](https://en.wikipedia.org/wiki/UTF-16): A variable-length encoding that produces either 2 or 4 bytes per character.
- [UTF-32 / UCS-4](https://en.wikipedia.org/wiki/UTF-32): A fixed-length encoding that produces 4 bytes per character.
- Charcodes: A sequence of code points. It's equivalent to UCS-4, but replaces the fixed-length
  chunks of four bytes with space-separated numbers between `0` and `0x10ffff`.

This converter is only for Unicode text. Use the [binary converter](/converters/binary) for arbitrary byte sequences.

### Bases

The bytes can be presented in binary, octal, decimal or hexadecimal bases.
The binary, octal and hexadecimal bytes are padded to a fixed length (8, 3 and 2 digits
per byte); the decimal presentation is space-separated.

The [Base64](https://en.wikipedia.org/wiki/Base64) encoding is a special case
for rendering byte sequences as printable alphanumeric characters (plus the characters
  `/`, `+` and `=`).

The [PGP word list](https://en.wikipedia.org/wiki/PGP_word_list) encodes bytes as a sequence
of words, and is useful for conveying data over an audio channel.

The `Raw` format simply prints the string as it should be presented. Note that
most valid code points are either unassigned or do not have a glyph in the
current font; characters may either be missing or presented as a square box.

