---
title: Huffman code
scripts:
  - heap.js
  - '../util.js'
  - huffman.js
---

This is a [Huffman code](https://en.wikipedia.org/wiki/Huffman code) compression tool.
Any text in the input will be profiled for generating an optimum variable-length
prefix-free code, then compressed into bytes using that code.

<div><span id="error" class="error"></span></div>
<label for="source">Source</label><textarea id="source" rows="5"></textarea>
<label for="tree">Code</label><textarea id="tree" rows="5"></textarea>
<label for="bytes">Output</label><textarea id="bytes" rows="5"></textarea>

<div id="stats"></div>

<table id="code"></table>

The compression statistics include the description of the Huffman tree itself.
The tree here is represented as a preorder traversal, with the internal node
symbol defaulting to `~` (thus `~a~bc` stands for encoding a, b, c as 0, 10,
and 11 respectively). This encoding is `2N-1` characters for an alphabet of size N,
as there are always `N-1` internal nodes in the tree.

The first four bytes of the output are a length header, which ensures that overhang
bits are discarded while decoding.
