#include "state.h"

using namespace std;

static std::string StName[] = { "START", "DEFEND", "CONTINUE", "ADD" };

std::ostream& operator<<(std::ostream& os, const State& X) {
    os << "1: " << X.A << ", 2: " << X.B << ", tr: " << Card::suits[X.Tr];
    os << ", State: " << StName[X.St];
    if (X.M) os << " * " << X.M;
    if (X.T) os << ", T: " << X.T;
    return os;
}

std::vector<char> State::valid() const {
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
        int64_t mask = T;
        mask = mask | (mask >> 9) | (mask >> 18) | (mask >> 27);
        mask = mask | (mask << 9) | (mask << 18) | (mask << 27);
        for (auto i = 0; i < Hand::SZ; i++) {
            if (A & t & mask) V.push_back(i);
            t <<= 1;
        }
    }
    return V;
}

State State::move(char m) {
    State R(*this);
    if (St == START) {
        R.Lm = B.count();
        if (R.Lm > 6) R.Lm = 6;
        R.M += m;
        R.A -= m;
        R.T += m;
        R.flip();
        R.St = DEFEND;
        R.Lm--;
    }
    else if (St == DEFEND) {
        R.M.clear();
        if (m == -1) {
            R.St = ADD;
        }
        else {
            R.A -= m;
            R.T += m;
            R.St = CONTINUE;
        }
        R.flip();
    }
    else if (St == CONTINUE) {
        if (m == -1) {
            R.T.clear();
            R.St = START;
        }
        else {
            R.M += m;
            R.A -= m;
            R.T += m;
            R.St = DEFEND;
            R.Lm--;
        }
        R.flip();
    }
    else if (St == ADD) {
        if (m == -1) {
            R.B += R.T;
            R.T.clear();
            R.St = START;
        }
        else {
            R.A -= m;
            R.T += m;
        }
    }
    return R;
}