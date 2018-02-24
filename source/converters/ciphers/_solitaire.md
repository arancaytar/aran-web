# Help

The [Solitaire cipher](https://en.wikipedia.org/wiki/Solitaire_cipher) was
created by [Bruce Schneier](https://en.wikipedia.org/wiki/Bruce_Schneier) for
the [Neal Stephenson](https://en.wikipedia.org/wiki/Neal_Stephenson) novel
[Cryptonomicon](https://en.wikipedia.org/wiki/Cryptonomicon).
It uses a standard deck of playing cards (54, with two jokers) to perform manual
computations.

The cipher can be used in two different modes:

1. With two decks, by shuffling one and duplicating its order in the other.
   Each communicating party receives one deck; their order becoming the shared
   secret for generating the keystream.
2. With a shared password, by using it as a seed for generating a deck order.
   Each letter of the password represents a single cut of the deck, so the
   password needs to be fairly long to shuffle it well.

The first method is arguably more secure if followed diligently (by removing the
possibility of guessing the password), but a password is easier to exchange than
a deck of cards, and also more robust than trying to generate a truly random
deck order by manual shuffling.

To enter a deck order manually, use the following syntax:

- 54 cards, separated by spaces, in order.
- Each card is either a joker (`A` or `B`) or two characters for rank and suit.
- The rank is one of `A, T, J, Q, K` (for Ace, Ten, Jack, Queen, King) or a
  digit from 2 to 9.
- The suit is one of `c, d, h, s` or `♣, ♦, ♥, ♠` for Clubs, Diamonds, Hearts,
  Spades, respectively.

Example: `Ts Kd B 2s A` is "Ten of spades, King of diamonds, Joker B,
Two of spades, Joker A ..."
