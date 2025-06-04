#include <iostream>
#include "deck.h"

using namespace std;

int main()
{
    Deck D;
    cout << D << endl;
    D.shuffle();
    cout << D << endl;
    D.shuffle();
    cout << D << endl;
    D.shuffle();
    cout << D << endl;

    Hand H;
    H += Card::C6;
    H += Card::D6;
    cout << H << endl;
    H -= Card::D6;
    cout << H << endl;
}