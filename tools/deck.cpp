#include <iostream>
#include <random>
#include "deck.h"

const char* Card::ranks[] = { "6", "7", "8", "9", "10", "J", "Q", "K", "A" };
const char* Card::suits[] = { "C", "D", "S", "H" };

void Deck::shuffle() {
    static std::random_device rd;
    std::shuffle(A.begin(), A.end(), rd);
}
