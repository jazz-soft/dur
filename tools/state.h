#ifndef _STATE_H_
#define _STATE_H_

#include <iostream>
#include "deck.h"

class State {
public:
    State() : Tr(0) {}
    template<typename T1, typename T2, typename T3> State(T1 a, T2 b, T3 t) : A(a), B(b), Tr(t) {}
    friend std::ostream& operator<<(std::ostream& os, const State& X);
private:
    Hand A, B, T;
    unsigned char Tr;
};

#endif // _STATE_H_