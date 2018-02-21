const ui = ($ => {
  const dom = {
    input: $('#input'),
    output: $('#output'),
    memory: $('#memory'),
    size: $('#size'),
    start: $('#start'),
    type: $('#type')
  };

  const analyze = (tokens, memory) => {
    const transition = {};
    for (let i = memory; i < tokens.length; i++) {
      const previous = tokens.slice(i - memory, i).join(' ');
      const next = tokens[i];
      const chain = transition[previous] = transition[previous] || [];
      chain.push(next);
    }

    return transition;
  }

  const randRange = (a, b) => a + Math.floor((1 + b - a) * Math.random());
  const pickRandom = arr => arr[randRange(0, arr.length - 1)];

  const generate = (chain, memory, size, seed) => {
    const output = seed;
    for (let i = output.length; i < size; i++) {
      const previous = output.slice(i - memory, i).join(' ');
      output.push(pickRandom(chain[previous]));
    }
    return output;
  }

  const run = (input, type, memory, size) => {
    const tokens = input.split(type === 'words' ? /\s+/ : '');
    // Make the circle complete.
    tokens.push(...tokens.slice(0, memory));
    const chain = analyze(tokens, memory);
    const i = randRange(0, tokens.length - memory);
    const seed = tokens.slice(i, i + memory);
    const output = generate(chain, memory, size, seed);
    return output.join(type === 'words' ? ' ' : '');
  }

  const main = () => {
    dom.output.innerText = run(
      dom.input.value,
      dom.type.value,
      +dom.memory.value,
      +dom.size.value
    );
    dom.output.hidden = false;
  }

  dom.start.onclick = main;

  return {
    dom,
    run,
    main
  };
})(document.querySelector.bind(document));
