function Bot(G, n) {
    var i;
    this.n = n;
    this.hands = [];
    for (i = 0; i < G.players; i++) this.hands[i] = [G.hands[i].length, []];
    this.hands[n][1] = G.hands[n].slice();
}

Bot.prototype.log = function() {
    var i, k, n;
    var a, b = [];
    for (i = 0; i < this.hands.length; i++) {
        a = [];
        for (k = 0; k < this.hands[i][1].length; k++) a.push(name(this.hands[i][1][k]));
        for (; k < this.hands[i][0]; k++) a.push('?');
        b.push(a.join(', '));
    }
    console.log(b.join(' -- '));
}

Bot.prototype.seen = function(n, c) {
    if (this.hands[n][1].indexOf(c) == -1) this.hands[n][1].push(c);
    this.hands[n][1].sort(Deck.compare);
}

Bot.prototype.play = function(G) {
    play(G, this.n, this.valid(G)[0]);
}

Bot.prototype.valid = function(G) {
    var a = [];
    for (var c of this.hands[this.n][1]) if (valid(G, this.n, c)) a.push(c);
    if (valid(G, this.n, -1)) a.push(-1);
    return a;
}