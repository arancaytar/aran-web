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

The compression statistics do not count the description of the code itself, which
must also be transmitted as part of the text. The code is here shown as a JSON tree;
the shortest practical encoding would actually be only twice the alphabet size.
