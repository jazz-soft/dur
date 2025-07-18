function Bot(m, n) {
    var i;
    this.n = n;
    this.hands = [];
    for (i = 0; i < m; i++) this.hands[i] = [0, []];
    this.bito = [];
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
    a = [];
    for (k = 0; k < this.bito.length; k++) a.push(name(this.bito[k]));
    b.push(a.join(', '));
    console.log(b.join(' -- '));
}

Bot.prototype.seen = function(n, c) {
    if (this.hands[n][1].indexOf(c) == -1) this.hands[n][1].push(c);
    this.hands[n][1].sort(Deck.compare);
}

Bot.prototype.add = function(n, c) {
    if (n == this.n) {
        this.hands[n][1].push(c);
        this.hands[n][1].sort(Deck.compare);
    }
    this.hands[n][0]++;
}

Bot.prototype.remove = function(n, c) {
    var k = this.hands[n][1].indexOf(c);
    if (k != -1) this.hands[n][1].splice(k, 1);
    this.hands[n][0]--;
}

Bot.prototype.trash = function(c) {
    if (this.bito.indexOf(c) == -1) this.bito.push(c);
    this.bito.sort(Deck.compare);
}

Bot.prototype.deduce = function(G) {
    if (G.indeck > 1) return;
    var k, h, x;
    k = 0;
    for (x of this.hands) {
        if (x[0] == x[1].length) continue;
        k++;
        h = x;
    }
    if (k != 1) return;
    var a = {};
    if (G.indeck == 1) a[G.G.deck.A[35]] = true;
    for (k of this.bito) a[k] = true;
    for (x of G.table) for (k of x) a[k] = true;
    for (x of this.hands) {
        if (x == h) continue;
        for (k of x[1]) a[k] = true;
    }
    h[1] = [];
    for (k = 0; k < 36; k++) if (!a[k]) h[1].push(k);
    h[1].sort(Deck.compare);
}

Bot.prototype.play = function(G) {
    this.deduce(G);
    play(G, this.n, this.valid(G)[0]);
}

Bot.prototype.valid = function(G) {
    var a = [];
    for (var c of this.hands[this.n][1]) if (valid(G, this.n, c)) a.push(c);
    a.sort(Deck.byrank(G.trump));
    if (valid(G, this.n, -1)) a.push(-1);
    return a;
}