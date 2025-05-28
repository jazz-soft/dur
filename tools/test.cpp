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
}