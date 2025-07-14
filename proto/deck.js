function suit(n) { return Math.floor(n / 9); }
function rank(n) { return n % 9; }
function name(n) { return [6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'][rank(n)] + '\u2663\u2666\u2660\u2665'[suit(n)]; }
function weight(n, t) { return rank(n) + (suit(n) == t ? 9 : 0); }

function Deck(D) { this.A = D ? D.A.slice() : [...Array(36).keys()]; }
Deck.prototype.shuffle = function() {
    var n = this.A.length;
    var k, x;
    while (n) {
        k = Math.floor(Math.random() * n);
        n--;
        x = this.A[k];
        this.A[k] = this.A[n];
        this.A[n] = x;
    }
}
Deck.prototype.card = function(n) { return this.A[n]; }
Deck.compare = function(a, b) { return a - b; }
Deck.byrank = function(t) {
    return [
        function(a, b) { return weight(a, 0) - weight(b, 0); },
        function(a, b) { return weight(a, 1) - weight(b, 1); },
        function(a, b) { return weight(a, 2) - weight(b, 2); },
        function(a, b) { return weight(a, 3) - weight(b, 3); }
    ][t];
}

function State(opt) {
    var i, n;
    opt = opt || {};
    this.deck = new Deck(opt.deck);
    if (!opt.deck) this.deck.shuffle();
    this.trump = suit(this.deck.card(35));
    n = opt.players;
    if (!n || n != parseInt(n) || n < 2 || n > 6) {
        this.pairs = true;
        n = 4;
    }
    this.players = n;
    this.hands = [];
    this.flash = [];
    this.bots = [];
    for (i = 0; i < this.players; i++) {
        this.flash[i] = [];
        this.hands[i] = [];
    }
    this.indeck = 36;
    for (i = 0; i < this.players; i++) this.bots[i] = new Bot(this.players, i);
    this.deal(1);
    n = opt.turn;
    if (n != parseInt(n) || n < 0 || n >= this.players) {
        n = smallest_trump(this);
        for (i = 0; i < this.players; i++) this.bots[i].seen(n[0], n[1]);
        this.flash[n[0]].push(n[1]);
        n = n[0];
    }
    this.att = n;
    this.def = (n + 1) % this.players;
    this.table = [];
    this.gui = [];
    this.newround();
}
State.prototype.update = function() {
    for (var g of this.gui) g.set(this);
}
State.prototype.loop = function() {
    var self = this;
    if (this.ended()) {
        this.state = 0;
        this.att = -1;
        this.def = -1;
        for (var k = 0; k < this.hands.length; k++) if (this.hands[k].length) break;
        setTimeout(function() { alert('player ' + k + ' lost!'); }, 1000);
    }
    else if (this.state == 5) {
        setTimeout(function() { self.endround(); }, 1000);
    }
    else if (this.state == 6) {
        setTimeout(function() { self.takeall(); }, 1000);
    }
    else {
        var next = this.state == 2 ? this.def : this.turn;
        if (next) setTimeout(function() { self.bots[next].play(self); }, 1000);
    }
    this.update();
}
State.prototype.deal = function(n) {
    var i, k, m, p, a, b;
    p = 36 - this.indeck;
    for (i = 0; i < this.players; i++) {
        if (!this.indeck) return;
        k = 6 - this.hands[n].length;
        if (k > this.indeck) k = this.indeck;
        if (k > 0) {
            a = this.deck.A.slice(p, p + k);
            this.hands[n] = this.hands[n].concat(a);
            this.hands[n].sort(Deck.compare);
            for (b of this.bots) for (m = 0; m < k; m++) b.add(n, a[m]);
            this.indeck -= k;
            p += k;
        }
        n = (n + 1) % this.players;
    }
}
State.prototype.newround = function() {
    this.state = 1;
    this.turn = this.att;
    this.lim = this.hands[this.def].length;
    if (this.lim > 6) this.lim = 6;
    this.seq = [this.att];
    for (var n = (this.att + 1) % this.players; n != this.att; n = (n + 1) % this.players) {
        if (n == this.def) continue;
        // todo: 2x2
        this.seq.push(n);
    }
    this.vist = 0;
}
State.prototype.endround = function() {
    var c, i, j, k;
    for (i = 0; i < this.table.length; i++) for (j = 0; j < this.table[i].length; j++) {
        c = this.table[i][j];
        for (k = 0; k < this.bots.length; k++) this.bots[k].trash(c);
    }
    this.deal(this.att);
    for (k = this.def; !this.hands[k].length; k = (k + 1) % this.players) {
        // todo: 2x2
    }
    this.att = k;
    this.def = this.next(k);
    this.table = [];
    this.update();
    this.newround();
    this.loop();
}
State.prototype.takeall = function() {
    var c, i, j, k;
    for (i = 0; i < this.table.length; i++) for (j = 0; j < this.table[i].length; j++) {
        c = this.table[i][j];
        this.hands[this.def].push(c);
        this.flash[this.def].push(c);
        for (k = 0; k < this.bots.length; k++) {
            this.bots[k].add(this.def, c);
            this.bots[k].seen(this.def, c);
        }
    }
    this.hands[this.def].sort(Deck.compare);

    this.deal(this.att);
    this.att = this.next(this.def);
    this.def = this.next(this.att);
    this.table = [];
    this.update();
    this.newround();
    this.loop();
}
State.prototype.next = function(k) {
    for (k = (k + 1) % this.players; !this.hands[k].length; k = (k + 1) % this.players) {
        // todo: 2x2
    }
    return k;
}
State.prototype.done = function() {
    var i, k;
    if (this.lim <= this.table.length) return true;
    for (i = 0; i < this.seq.length; i++) {
        k = this.seq[this.vist];
        if (this.hands[k].length && !this.pass[k]) break;
        this.pass[k] = true;
        this.vist = (this.vist + 1) % this.seq.length;
    }
    this.turn = k;
    return !!this.pass[k];
}
State.prototype.ended = function() {
    if (this.indeck) return false;
    var n = 0;
    for (var x of this.hands) {
        if (x.length) n++;
        if (n > 1) return false;
    }
    return true;
}

function smallest_trump(G) {
    var i, j, k, n = 0, m = 99;
    for (i = 0; i < G.players; i++) {
        for (j = 0; j < 6; j++) {
            k = G.hands[i][j];
            if (suit(k) != G.trump || k > m) continue;
            m = k;
            n = i;
            break;
        }
    }
    return [n, m];
}

var canplay = { 1: true, 3: true, 4: true };
function valid(G, h, c) {
    var a, x;
    if (h == G.turn && canplay[G.state]) {
        if (!G.table.length) return c != -1;
        for (a of G.table) for (x of a) if (rank(x) == rank(c)) return true;
        return c == -1;
    }
    if (h == G.def) {
        if (G.state != 2) return false;
        for (a of G.table) if (a.length == 1) {
            x = a[0];
            if (suit(x) == suit(c) && rank(c) > rank(x) || suit(x) != G.trump && suit(c) == G.trump) return true;
        }
        return c == -1;
    }
    return false;
}

function play(G, h, c) {
    var s = 'player ' + h;
    var k, c;
    if (c == -1) s += h == G.def ? ' takes.' : ' done.';
    else s += ' plays ' + name(c);
    for (k = 0; k < G.bots.length; k++) G.bots[k].log();
    console.log(s);
    alert(s);
    if (c != -1) {
        G.hands[h].splice(G.hands[h].indexOf(c), 1);
        for (k = 0; k < G.bots.length; k++) G.bots[k].remove(h, c);
    }
    if (h == G.def) {
        if (c == -1) {
            G.state = G.done() ? 6 : 4;
        }
        else {
            G.table[G.table.length - 1].push(c);
            G.state = G.done() ? 5 : 3;
        }
    }
    else {
        if (c == -1) {
            G.pass[h] = true;
            G.vist = (G.vist + 1) % G.seq.length;
            G.turn = G.seq[G.vist];
            if (G.done()) G.state = G.state == 4 ? 6 : 5;
        }
        else {
            G.pass = {};
            G.table.push([c]);
            if (G.done()) G.state = G.state == 4 ? 6 : 2;
            else G.state = G.state == 4 ? 4 : 2;
        }
    }
    G.update();
    G.loop();
}
