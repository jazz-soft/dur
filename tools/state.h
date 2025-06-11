#ifndef _STATE_H_
#define _STATE_H_

#include <iostream>
#include "deck.h"

class State {
public:
    State() {}
    friend std::ostream& operator<<(std::ostream& os, const State& X);
private:
    Hand A, B, T;
};

#endif // _STATE_H_