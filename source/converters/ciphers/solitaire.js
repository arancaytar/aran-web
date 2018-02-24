const Solitaire = (() => {
  const JOKERS = {53: 'A', 54: 'B'};
  const SUITS = 'cdhs';
  const VALUES = 'A23456789TJQK';
  const SUITS_UNICODE = '♣♦♥♠';

  const flip = iterable => {
    const ret = {};
    for (let i in iterable) ret[iterable[i]] = +i;
    return ret;
  };

  const REV_JOKERS = flip(JOKERS);
  const REV_SUITS = flip(SUITS);
  const REV_VALUES = flip(VALUES);
  Object.assign(REV_SUITS, flip(SUITS_UNICODE));

  const readCard = string => {
    if (string in REV_JOKERS) return REV_JOKERS[string];
    const rank = string.match(/[A23456789TJQK]/);
    const suit = string.match(/[cdhsCDHS♣♦♥♠]/);
    if (rank && suit) return 13*REV_SUITS[suit[0].toLowerCase()] + REV_VALUES[rank[0]] + 1;
    throw `Error: <code>${string}</code> is not a valid card.`;
  }

  const cardWriter = (suits=SUITS) => code =>
    (code in JOKERS) ? JOKERS[code] :
    `${VALUES[(code-1) % 13]}${suits[Math.floor((code-1) / 13)]}`;

  const Solitaire = class {
  };

  const Deck = class {
    constructor(deck) {
      this.deck = deck;
    }

    static create() {
      return new this(Array(54).fill(0).map((_,i) => i + 1));
    }

    static fromInput(input) {
      const cards = input.replace(/[^ABTJQK2-9CDHScdhs♣♦♥♠\s]/g, '').trim().split(/\s+/);

      if (cards.length !== 54) {
        throw `Error: Found ${cards.length} instead of 54 cards.`;
      }

      const deck = cards.map(readCard);
      const positions = {};

      for (let i in deck) {
        const value = deck[i];
        if (positions[value] !== undefined) {
          throw `Error: Card #${i+1} <code>${cards[i]}</code> is a duplicate of #${positions[value]}`;
        }
        positions[value] = 1 + i;
      }

      return new this(deck);
    }

    static fromString(code) {
      return new this(Array.from(code).map(c => c.charCodeAt(0) - 32));
    }

    static fromPassword(word) {
      const deck = this.create();
      Array.from(word).forEach(e => deck.addPasswordLetter(e));
      return deck;
    }

    addPasswordLetter(letter) {
      this.shiftCut();
      this.countCut(letter.charCodeAt(0) - 64);
      return this;
    }

    toString() {
      return this.deck.map(c => String.fromCharCode(c + 32)).join('');
    }

    print({unicode=false, color=false}={}) {
      const suits = Array.from(unicode ? SUITS_UNICODE : SUITS);
      if (color) for (let i of [1, 2]) suits[i] = `<span style="color:red">${suits[i]}</span>`;
      return this.deck.map(cardWriter(suits)).join(' ');
    }

    search(code) {
      return this.deck.indexOf(+code);
    }

    getCard(index) {
      return Math.min(this.deck[index], 53);
    }

    shiftCut() {
      // Move the first joker one place, then the second two places.
      this.debug('Shiftcut starts');
      this.debug('Original ' + this.print({unicode:true}));
      this.swapDown(REV_JOKERS.A);
      this.debug('Swapped A: ' + this.print({unicode:true}));
      this.swapDown(REV_JOKERS.B);
      this.swapDown(REV_JOKERS.B);
      this.debug('Swapped B: ' + this.print({unicode:true}));
      // Divide the deck into three segments on the joker positions,
      // then swap the outer two segments.
      const [a,b] = Object.keys(JOKERS).map(x => this.search(x)).sort((a,b)=>a-b);
      this.debug(`Triplecut at ${[a,b]}`);
      const [x,y,z] = [this.deck.slice(0, a), this.deck.slice(a, b+1), this.deck.slice(b+1)];
      this.deck = z.concat(y, x);
      this.debug('Shiftcut complete: ' + this.print({unicode:true}));
      if (this.deck.length !== 54) throw this.deck.length;

      // Finally, take the last card, cut and swap the remaining deck at that index,
      // and put the last card on top.
      this.countCut(Math.min(this.deck[53], 53));
      return this;
    }

    swapDown(card) {
      // Swap a specific card with the one below it.
      // However, treat the deck as closed under cyclical shifts:
      // The operation of placing the last card onto the first is not a swap.
      if (this.deck[53] === card) {
        this.cycleShift();
      }
      const key = this.search(card);
      const key2 = (key + 1) % 54;
      this.deck[key] = this.deck[key2];
      this.deck[key2] = card;
      if (this.deck.length != 54) throw 'bad';
      return this;
    }

    cycleShift() {
      this.deck.unshift(this.deck.pop());
    }

    countCut(count) {
      // Remove the last card, then divide the deck into two segments at a given
      // index, then swap segments.
      // Finally, put the removed card at the bottom of the deck.
      const [x,y,z] = [this.deck.slice(0, count), this.deck.slice(count, 53), this.deck.slice(53)];
      this.deck = y.concat(x, z);
      this.debug('Countcut complete: ' + this.print({unicode:true}));
      if (this.deck.length !== 54) throw -this.deck.length;
      return this;
    }

    nextKeyLetter() {
      let card = 54;
      while (card > 52) {
        card = this.getCard(this.shiftCut().getCard(0));
      }
      const letter = String.fromCharCode((card - 1) % 26 + 65);
      this.debug(`Next letter: ${letter}`);
      return letter;
    }

    *getKeyStream(length=0) {
      let i = 0;
      while (length <= 0 || i++ < length) {
        yield this.nextKeyLetter();
      }
    }

    encrypt(clear) {
      return combineText(clear, this.getKeyStream());
    }

    decrypt(ciphertext) {
      return combineText(ciphertext, this.getKeyStream(), -1);
    }

    toggle(text, encrypt=true) {
      return encrypt ? this.encrypt(text) : this.decrypt(text);
    }

    debug(...x) {
      if (document.debug) console.log(...x);
    }
  };

  const combineLetters = (a, b, sign=1) => {
    const ai = a.charCodeAt();
    const c = ai < 97;
    const letter = ai - (c ? 64 : 96);
    return String.fromCharCode((letter + sign * (b.charCodeAt() - 64) + 25) % 26 + (c ? 65 : 97));
  }

  const combineText = (clear, key, sign=1) => Array.from(clear)
    .map(c =>
      c.match(/[A-Za-z]/) ? combineLetters(c, key.next().value, sign) : c
    ).join('');

  return {Deck};
})();
