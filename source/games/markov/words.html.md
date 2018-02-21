---
title: Markov word chain
scripts: ['markov.js']
---
<input type="hidden" id="type" value="words" />
<label for="memory">Memory (words):</label>
<input id="memory" type="text" value="1" />
<label for="size">Output size:</label>
<input id="size" type="text" value="100" />
<button id="start" type="button">Generate</button>
<textarea id="input" rows="5">A Markov chain is a randomized sequence where the probabilities of the next state only depend on the current state. This can be used to generate random texts that superficially resemble a given source text.</textarea>
<div id="output" class="box" hidden></div>

A [Markov chain](https://en.wikipedia.org/wiki/Markov_chain) is a randomized
sequence where the probabilities of the next state only depends on the current
state. This can be used to generate random texts that superficially resemble a
given source text.

The memory of the generator is the number of previous words (usually one) that
are used to generate the next word. The generator begins by picking a random
sequence of N consecutive words of the input. In each step, it takes the final N
words of the output, finds a random occurrence of these in the input, and adds
the word that follows that occurrence.

(For completeness, the input text is considered to "wrap around".)
