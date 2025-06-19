function Bot(G, n) {
    var i;
    this.n = n;
    this.hands = [];
    for (i = 0; i < G.players; i++) this.hands[i] = [G.hands[i].length, []];
    this.hands[n][1] = G.hands[n].slice();
    this.log();
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