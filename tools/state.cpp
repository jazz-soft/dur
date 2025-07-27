#include "state.h"

using namespace std;

std::ostream& operator<<(std::ostream& os, const State& X) {
    os << "1: " << X.A << ", 2: " << X.B << ", tr: " << Card::suits[X.Tr] << ", T:";
    if (X.T) os << " " << X.T;
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
    return V;
}
