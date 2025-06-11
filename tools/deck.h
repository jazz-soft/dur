#ifndef _DECK_H_
#define _DECK_H_

#include <iostream>
#include <array>

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
    unsigned char rank() const { return V % 9; }
    template<typename T> operator T() const { return V; }
    friend std::ostream& operator<<(std::ostream& os, const Card& C) {
        os << ranks[C.rank()] << suits[C.suit()];
        return os;
    }
private:
    const unsigned char V;
    static const char* ranks[];
    static const char* suits[];
};

class Deck {
    static const unsigned char SZ = 36;
public:
    Deck() { for (auto i = 0; i < SZ; i++) A[i] = i; }
    auto size() const { return SZ;  }
    template<typename T> unsigned char operator[](T i) const { return A[i]; }
    void shuffle();
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

class Hand {
    static const unsigned char SZ = 36;
public:
    Hand() : H(0) {}
    Hand(int64_t h) : H(h) {}
    Hand(const Hand& h) : H(h.H) {}
    template<typename T> Hand& operator+(T x) {
        int64_t t = 1;
        t <<= x;
        H |= t;
        return *this;
    }
    template<typename T> Hand& operator-(T x) {
        int64_t t = 1;
        t <<= x;
        H &= ~t;
        return *this;
    }
    template<typename T> Hand& operator+=(T x) { return *this + x; }
    template<typename T> Hand& operator-=(T x) { return *this - x; }
    friend std::ostream& operator<<(std::ostream& os, const Hand& H) {
        bool first = true;
        int64_t t = 1;
        for (auto i = 0; i < SZ; i++) {
            if (H.H & t) {
                if (!first) os << " ";
                os << Card(i);
                first = false;
            }
            t <<= 1;
        }
        return os;
    }
private:
    int64_t H;
};

#endif // _DECK_H_