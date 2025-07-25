#include "state.h"

using namespace std;

std::ostream& operator<<(std::ostream& os, const State& X) {
    os << "1: " << X.A << ", 2: " << X.B << ", tr: " << Card::suits[X.Tr] << ", T:";
    if (X.T) os << " " << X.T;
    if (X.M) os << " * " << X.M;
    return os;
}
