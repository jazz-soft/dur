#include "state.h"

using namespace std;

std::ostream& operator<<(std::ostream& os, const State& X) {
    os << "1: " << X.A << ", 2: " << X.B << ", tr: " << Card::suits[X.Tr];
    if (X.T) os << ", T: " << X.T;
    if (X.M) os << " * " << X.M;
    return os;
}

std::vector<char> State::valid() {
    std::vector<char> V;
    int64_t t = 1;
    if (St == START) {
        for (auto i = 0; i < Hand::SZ; i++) {
            if (A & t) V.push_back(i);
            t <<= 1;
        }
    }
    else V.push_back(-1);
    if (St == DEFEND) {
        Card c = M;
        auto r = c.rank();
        auto s = c.suit();
        for (auto i = 0; i < Hand::SZ; i++) {
            if (A & t) {
                Card cc = i;
                auto rr =cc.rank();
                auto ss = cc.suit();
                if (s != Tr && ss == Tr || s == ss && r < rr) V.push_back(i);
            }
            t <<= 1;
        }
    }
    else if (St == CONTINUE || St == ADD) {
    }
    return V;
}
