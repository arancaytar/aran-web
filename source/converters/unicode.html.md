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

### Encodings

- [UTF-8](https://en.wikipedia.org/wiki/UTF-8): A variable-length encoding that
  produces between 1-4 bytes per
  character. Equivalent to ASCII on the ASCII character set.
- [UTF-16](https://en.wikipedia.org/wiki/UTF-16): A variable-length encoding
  that produces either 2 or 4 bytes per character.
- [UTF-32 / UCS-4](https://en.wikipedia.org/wiki/UTF-32): A fixed-length
  encoding that produces 4 bytes per character.
- Codepoints: The codepoint of each character, separated by spaces.

The *Raw* format simply prints the string as it should be represented. Note that
most valid code points are either unassigned or do not have a glyph in the
current font; characters may either be missing or represented as a square box.

This converter is only for Unicode text. Use the [binary converter](/converters/binary)
for arbitrary byte sequences.

### Bases

Numbers can be represented in binary, octal, decimal or hexadecimal bases.
When encoding bytes, the binary, octal and hexadecimal representations are
padded to a fixed length (8, 3 and 2 digits per byte). The decimal
representation, and all representations of codepoints, are space-separated.

[Base64](https://en.wikipedia.org/wiki/Base64) is a special encoding that
represents byte sequences as alphanumeric characters (plus the characters
  `/`, `+` and `=`), using four characters for every three bytes.

The [PGP word list](https://en.wikipedia.org/wiki/PGP_word_list) encodes bytes
as a sequence of words, and is useful for conveying data over an audio channel.

Note that both Base64 and PGP words encode a byte stream, and cannot be used
with codepoints, which are integers rather than bytes.
