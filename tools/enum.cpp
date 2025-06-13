#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <random>
#include "deck.h"
#include "state.h"

using namespace std;

map<string, unsigned char> Num = {
    {"C6",  0}, {"C7",  1}, {"C8",  2}, {"C9",  3}, {"C10",  4}, {"CJ",  5}, {"CQ",  6}, {"CK",  7}, {"CA",  8},
    {"D6",  9}, {"D7", 10}, {"D8", 11}, {"D9", 12}, {"D10", 13}, {"DJ", 14}, {"DQ", 15}, {"DK", 16}, {"DA", 17},
    {"S6", 18}, {"S7", 19}, {"S8", 20}, {"S9", 21}, {"S10", 22}, {"SJ", 23}, {"SQ", 24}, {"SK", 25}, {"SA", 26},
    {"H6", 27}, {"H7", 28}, {"H8", 29}, {"H9", 30}, {"H10", 31}, {"HJ", 32}, {"HQ", 33}, {"HK", 34}, {"HA", 35},
    {"6C",  0}, {"7C",  1}, {"8C",  2}, {"9C",  3}, {"10C",  4}, {"JC",  5}, {"QC",  6}, {"KC",  7}, {"AC",  8},
    {"6D",  9}, {"7D", 10}, {"8D", 11}, {"9D", 12}, {"10D", 13}, {"JD", 14}, {"QD", 15}, {"KD", 16}, {"AD", 17},
    {"6S", 18}, {"7S", 19}, {"8S", 20}, {"9S", 21}, {"10S", 22}, {"JS", 23}, {"QS", 24}, {"KS", 25}, {"AS", 26},
    {"6H", 27}, {"7H", 28}, {"8H", 29}, {"9H", 30}, {"10H", 31}, {"JH", 32}, {"QH", 33}, {"KH", 34}, {"AH", 35}
};
map<string, unsigned char> Trmp = {{"C", 0}, {"D", 1}, {"S", 2}, {"H", 3}};
vector<string> Suit = { "C",  "D",  "S",  "H" };

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
    cout << "; Tr: " << Suit[tr] << endl;
    State X(H1, H2, tr);
    cout << X << endl;
}
