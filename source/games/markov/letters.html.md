---
title: Markov letter chain
scripts: ['markov.js']
---
<input type="hidden" id="type" value="letters" />
<label for="memory">Memory (words):</label>
<input id="memory" type="text" value="1" />
<label for="size">Output size:</label>
<input id="size" type="text" value="100" />
<button id="start" type="button">Generate</button>
<textarea id="input" rows="5" placeholder="Input text"></textarea>
<div id="output" class="box" hidden></div>

This generator works exactly like the [Markov word generator](words). However,
instead of considering the input as a space-separated list of words, it operates
on the individual characters of the input.
