#ifndef _STATE_H_
#define _STATE_H_

#include <iostream>
#include <utility>
#include "deck.h"

class State {
public:
    enum { START = 0, DEFEND, CONTINUE, ADD };
    State() : Tr(0), St(0) {}
    State(const State& X) : A(X.A), B(X.B), T(X.T), M(X.M), Tr(X.Tr), St(X.St) {}
    template<typename T1, typename T2, typename T3> State(T1 a, T2 b, T3 t) : A(a), B(b), Tr(t), St(0) {}
    State& flip() { std::swap(A, B); return *this; }
    friend std::ostream& operator<<(std::ostream& os, const State& X);
private:
    Hand A, B, T, M;
    unsigned char Tr, St;
};

#endif // _STATE_H_