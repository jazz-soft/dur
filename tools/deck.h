#include <iostream>
#include <array>
#include <algorithm>

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

class Deck {
    static const unsigned char SZ = 36;
public:
    Deck() { for (auto i = 0; i < SZ; i++) A[i] = i; }
    auto size() const { return SZ;  }
    template<typename T> unsigned char operator[](T i) const { return A[i]; }
    void shuffle() { std::random_shuffle(A.begin(), A.end()); }
    friend std::ostream& operator<<(std::ostream& os, const Deck& D) {
        for (auto i = 0; i < D.size(); i++) {
            if (i) os << " ";
            os << Card(D[i]);
        }
        return os;
    }
private:
    std::array<unsigned char, SZ> A;
};