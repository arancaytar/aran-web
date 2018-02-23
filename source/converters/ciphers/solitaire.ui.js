const ui = (($, Solitaire) => {
  const dom = {
    input: $('#input'),
    output: $('#output'),
    password: $('#password'),
    deck: $('#deck'),
    direction: $('#direction'),
    preserve: $('#preserve')
  };

  const chunkText = (text, k=5) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += k) {
      chunks.push(text.substring(i, i+k));
    }
    return chunks.join(' ');
  };

  const cleanText = text => text.toUpperCase().replace(/[^A-Z]/g, '');

  const run = () => {
    const input = dom.preserve.checked ? dom.input.value : cleanText(dom.input.value);
    const output = Solitaire.Deck.fromInput(dom.deck.innerText).toggle(input, !dom.direction.checked);
    dom.output.innerText = dom.preserve.checked ? output : chunkText(output);
    dom.output.hidden = !input;
  };

  dom.input.oninput = dom.direction.onchange = dom.preserve.onchange = run;

  const setPassword = () => {
    const password = cleanText(dom.password.value);
    const deck = Solitaire.Deck.fromPassword(password);
    dom.deck.innerHTML = deck.print({unicode: true, color:true});
    run();
  };
  dom.password.oninput = setPassword;

  dom.deck.oninput = () => {
    dom.password.value = '';
  };

  setPassword();

  return {dom, run, setPassword};
})(
  document.querySelector.bind(document),
  Solitaire
);
