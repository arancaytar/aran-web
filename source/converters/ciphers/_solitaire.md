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
2. With a shared password, by using it as a seed for shuffling a deck and
   generating a pseudo-random initial state.

The first method is arguably more secure if followed diligently (by removing the
possibility of guessing the password), but a password is easier to exchange than
a deck of cards, and also more robust than trying to generate a truly random
deck order by manual shuffling.
