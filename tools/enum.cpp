#include <iostream>
#include <string>
#include <map>
#include "deck.h"
#include "enum.h"

using namespace std;

map<string, unsigned char> Num = {
    {"S6",  0}, {"S7",  1}, {"S8",  2}, {"S9",  3}, {"S10",  4}, {"SJ",  5}, {"SQ",  6}, {"SK",  7}, {"SA",  8},
    {"H6",  9}, {"H7", 10}, {"H8", 11}, {"H9", 12}, {"H10", 13}, {"HJ", 14}, {"HQ", 15}, {"HK", 16}, {"HA", 17},
    {"D6", 18}, {"D7", 19}, {"D8", 20}, {"D9", 21}, {"D10", 22}, {"DJ", 23}, {"DQ", 24}, {"DK", 25}, {"DA", 26},
    {"C6", 27}, {"C7", 28}, {"C8", 29}, {"C9", 30}, {"C10", 31}, {"CJ", 32}, {"CQ", 33}, {"CK", 34}, {"CA", 35}
};

int main(int argc, char* argv[])
{
    for (int i = 1; i < argc; i++) {
        cout << argv[i] << endl;
        if (Num.find(argv[i]) != Num.end()) {
            cout << (int)Num[argv[i]] << endl;
        }
    }
}