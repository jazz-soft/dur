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
map<string, unsigned char> Trmp = {{"S", 0}, {"H", 1}, {"D", 2}, {"C", 3}};

int num(const string& s) {
    try {
        return stoi(s);
    }
    catch (...) {
        return -1;
    }
}

void usage(const string& s) {
    auto ss = s.substr(s.find_last_of("\\/") + 1);
    cout << "Usage:\n  " << ss << " <number> <number>\n  " << ss << " <card> ... <card> - <card> ... <card> - <trump>\n";
    cout << "where\n  <number> - number of random cards in both hands;\n";
    cout << "  <card> ... <card> - cards in each hand, e.g. S10 = 10 of Spades, DA = Ace of Diamonds, etc...\n";
    cout << "  <trump> - trump suit, one of S/H/D/C\n";
}

int main(int argc, char* argv[]) {
    usage(argv[0]);
    int n1 = -1, n2 = -1;
    if (argc == 3) {
        n1 = num(argv[1]);
        n2 = num(argv[2]);
    }
    if (n1 >= 2 && n2 >= 1 && n1 + n2 <= 36) {
    }
    else {
        for (int i = 1; i < argc; i++) {
            cout << argv[i] << endl;
            if (Num.find(argv[i]) != Num.end()) {
                cout << (int)Num[argv[i]] << endl;
            }
        }
    }
}