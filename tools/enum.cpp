#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <random>
#include "deck.h"
#include "enum.h"

using namespace std;

map<string, unsigned char> Num = {
    {"S6",  0}, {"S7",  1}, {"S8",  2}, {"S9",  3}, {"S10",  4}, {"SJ",  5}, {"SQ",  6}, {"SK",  7}, {"SA",  8},
    {"H6",  9}, {"H7", 10}, {"H8", 11}, {"H9", 12}, {"H10", 13}, {"HJ", 14}, {"HQ", 15}, {"HK", 16}, {"HA", 17},
    {"D6", 18}, {"D7", 19}, {"D8", 20}, {"D9", 21}, {"D10", 22}, {"DJ", 23}, {"DQ", 24}, {"DK", 25}, {"DA", 26},
    {"C6", 27}, {"C7", 28}, {"C8", 29}, {"C9", 30}, {"C10", 31}, {"CJ", 32}, {"CQ", 33}, {"CK", 34}, {"CA", 35},
    {"6S",  0}, {"7S",  1}, {"8S",  2}, {"9S",  3}, {"10S",  4}, {"JS",  5}, {"QS",  6}, {"KS",  7}, {"AS",  8},
    {"6H",  9}, {"7H", 10}, {"8H", 11}, {"9H", 12}, {"10H", 13}, {"JH", 14}, {"QH", 15}, {"KH", 16}, {"AH", 17},
    {"6D", 18}, {"7D", 19}, {"8F", 20}, {"9D", 21}, {"10D", 22}, {"JD", 23}, {"QD", 24}, {"KD", 25}, {"AD", 26},
    {"6C", 27}, {"7C", 28}, {"8C", 29}, {"9C", 30}, {"10C", 31}, {"JC", 32}, {"QC", 33}, {"KC", 34}, {"AC", 35}
};
map<string, unsigned char> Trmp = {{"S", 0}, {"H", 1}, {"D", 2}, {"C", 3}};
vector<string> Suit = { "S",  "H",  "D",  "C" };

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
    map<unsigned char, bool> M1, M2;
    vector<unsigned char> H1, H2;
    int n1 = -1, n2 = -1, tr = -1;
    int n;
    random_device rd;
    if (argc == 3) {
        n1 = num(argv[1]);
        n2 = num(argv[2]);
    }
    if (n1 >= 2 && n2 >= 1 && n1 + n2 <= 36) {
        Deck D;
        D.shuffle();
        for (n = 0; n < n1; n++) M1[D[n]] = true;
        for (n = n1; n < n1 + n2; n++) M2[D[n]] = true;
        tr = rd() & 3;
    }
    else {
        string dash = "-";
        unsigned char c = 0;
        for (int i = 1; i < argc; i++) {
            if (!dash.compare(argv[i])) {
                c++;
            }
            else if (Num.find(argv[i]) != Num.end() && c < 2) {
                (c ? M2 : M1)[Num[argv[i]]] = true;
            }
            else if (Trmp.find(argv[i]) != Trmp.end() && c == 2 && tr == -1) {
                tr = Trmp[argv[i]];
            }
            else {
                usage(argv[0]);
                exit(0);
            }
        }
    }
    for (auto it = M1.begin(); it != M1.end(); it++) if (it->second) H1.push_back(it->first);
    for (auto it = M2.begin(); it != M2.end(); it++) if (it->second) H2.push_back(it->first);
    cout << "1:";
    for (auto x : H1) cout << " " << Card(x);
    cout << "; 2:";
    for (auto x : H2) cout << " " << Card(x);
    cout << "; Trump: " << Suit[tr] << endl;
}