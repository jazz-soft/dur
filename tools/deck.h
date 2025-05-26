#include <iostream>

class Card {
public:
    enum {
        S6, S7, S8, S9, S10, SJ, SQ, SK, SA,
        H6, H7, H8, H9, H10, HJ, HQ, HK, HA,
        D6, D7, D8, D9, D10, DJ, DQ, DK, DA,
        C6, C7, C8, C9, C10, CJ, CQ, CK, CA
    };
    Card(unsigned char v) : V(v) {};
    unsigned char suit() const { return V / 9; }
    unsigned char value() const { return V % 9; }
    friend std::ostream& operator<<(std::ostream& os, const Card& C) {
        os << values[C.value()] << suits[C.suit()];
        return os;
    }
private:
    const unsigned char V;
    static const char* values[];
    static const char* suits[];
};