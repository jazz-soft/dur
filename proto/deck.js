const WIDTH = 71;
const HEIGHT = 96;

function card(n) {
    var x = 12;
    var y = 4;
    if (n >= 0 && n < 36) {
        x = [5, 6, 7, 8, 9, 10, 11, 12, 0][n % 9];
        y = [2, 3, 0, 1][Math.floor(n / 9)];
    }
    else if (n == 36) x = 10;
    else if (n == 37) x = 11;
    var span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.width = WIDTH + 'px';
    span.style.height = HEIGHT + 'px';
    span.style.backgroundImage = 'url("cards.png")';
    span.style.backgroundPositionX = (-x * WIDTH) + 'px';
    span.style.backgroundPositionY = (-y * HEIGHT) + 'px';
    return span;
}

function cardh(n) {
    var x = 1;
    var y = 12;
    if (n >= 0 && n < 36) {
        x = [3, 2, 5, 4][Math.floor(n / 9)];
        y = [5, 6, 7, 8, 9, 10, 11, 12, 0][n % 9];
    }
    else if (n == 36) y = 10;
    else if (n == 37) y = 11;
    var span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.width = HEIGHT + 'px';
    span.style.height = WIDTH + 'px';
    span.style.backgroundImage = 'url("cardsh.png")';
    span.style.backgroundPositionX = (-x * HEIGHT) + 'px';
    span.style.backgroundPositionY = (-y * WIDTH) + 'px';
    return span;
}

function suit(n) { return Math.floor(n / 9); }
function rank(n) { return n % 9; }
function name(n) { return [6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'][rank(n)] + '\u2663\u2666\u2660\u2665'[suit(n)]; }

function backv(n) {
    n = n || 0;
    var x = 12;
    var y = 4;
    if (n >= 0 && n < 12) {
        x = [0, 1, 2, 3, 4, 5, 6, 9, 0, 1, 3, 6][n];
        y = [4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5][n];
    }
    var span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.width = WIDTH + 'px';
    span.style.height = HEIGHT + 'px';
    span.style.backgroundImage = 'url("cards.png")';
    span.style.backgroundPositionX = (-x * WIDTH) + 'px';
    span.style.backgroundPositionY = (-y * HEIGHT) + 'px';
    return span;
}

function backh(n) {
    n = n || 0;
    var x = 1;
    var y = 12;
    if (n >= 0 && n < 12) {
        x = [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0][n];
        y = [0, 1, 2, 3, 4, 5, 6, 9, 0, 1, 3, 6][n];
    }
    var span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.width = HEIGHT + 'px';
    span.style.height = WIDTH + 'px';
    span.style.backgroundImage = 'url("cardsh.png")';
    span.style.backgroundPositionX = (-x * HEIGHT) + 'px';
    span.style.backgroundPositionY = (-y * WIDTH) + 'px';
    return span;
}

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

function State(opt) {
    var i, n, k;
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
    k = 0;
    for (i = 0; i < this.players; i++) {
        this.flash[i] = [];
        this.hands[i] = this.deck.A.slice(k, k + 6);
        this.hands[i].sort(Deck.compare);
        k += 6;
    }
    this.left = 36 - k;
    for (i = 0; i < this.players; i++) this.bots[i] = new Bot(this, i);
    n = opt.turn;
    if (n != parseInt(n) || n < 0 || n >= this.players) {
        n = smallest_trump(this);
        for (i = 0; i < this.players; i++) this.bots[i].seen(n[0], n[1]);
        this.flash[n[0]].push(n[1]);
        n = n[0];
    }
    this.turn = n;
    this.att = n;
    this.def = (n + 1) % this.players;
    this.table = [];
    this.gui = [];
}
State.prototype.update = function() {
    for (var g of this.gui) g.set(this);
}
State.prototype.loop = function() {
    var self = this;
    if (!this.turn) return;
    setTimeout(function() { self.bots[self.turn].play(self); }, 1000);
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

function Gui(at) {
    this.div = document.createElement('div');
    this.div.style.display = 'inline-block';
    this.div.style.width = '100%';
    this.div.style.position = 'relative';
    document.body.appendChild(this.div);
}
Gui.prototype.init = function(G) {
    this.div.innerHTML = '';
    this.top = document.createElement('div');
    this.top.style.textAlign = 'center';
    this.top.style.height = '120px';
    this.div.appendChild(this.top);

    this.middle = document.createElement('div');
    this.middle.style.textAlign = 'center';

    this.div.appendChild(this.middle);
    this.left = document.createElement('div');
    this.left.style.display = 'inline-block';
    this.left.style.width = '220px';
    this.left.style.float = 'left';
    this.left.style.textAlign = 'right';
    this.middle.appendChild(this.left);

    this.right = document.createElement('div');
    this.right.style.display = 'inline-block';
    this.right.style.width = '220px';
    this.right.style.float = 'right';
    this.right.style.textAlign = 'left';
    this.middle.appendChild(this.right);

    this.center = document.createElement('div');
    this.center.style.display = 'inline-block';
    this.center.style.textAlign = 'left';
    this.center.style.width = '800px';
    this.middle.appendChild(this.center);

    this.centerup = document.createElement('div');
    this.center.appendChild(this.centerup);

    this.centerdown = document.createElement('div');
    this.centerdown.style.textAlign = 'center';
    this.center.appendChild(this.centerdown);

    this.div.appendChild(this.middle);
    this.bottom = document.createElement('div');
    this.bottom.style.textAlign = 'center';
    this.bottom.style.height = '120px';

    this.div.appendChild(this.bottom);
    this.deck = new GuiDeck(this.centerup);
    this.table = new GuiTable(this.centerdown);
    this.hands = [];
    this.hands.push(new GuiHand(this.bottom));
    if (G.players == 2) {
        this.hands.push(new GuiBack(1, this.top));
    }
    if (G.players == 3) {
        this.hands.push(new GuiBackL(1, this.left));
        this.hands.push(new GuiBackR(2, this.right));
    }
    else if (G.players == 4) {
        this.hands.push(new GuiBack(2, this.top));
        this.hands.push(new GuiBackL(1, this.left));
        this.hands.push(new GuiBackR(3, this.right));
    }
    else if (G.players == 5) {
        this.hands.push(new GuiBack(2, this.top));
        this.hands.push(new GuiBack(3, this.top));
        this.hands.push(new GuiBackL(1, this.left));
        this.hands.push(new GuiBackR(4, this.right));
    }
    else if (G.players == 6) {
        this.hands.push(new GuiBack(3, this.top));
        this.hands.push(new GuiBackL(2, this.left));
        this.hands.push(new GuiBackL(1, this.left));
        this.hands.push(new GuiBackR(4, this.right));
        this.hands.push(new GuiBackR(5, this.right));
    }

    this.set(G);
    G.gui.push(this);
}
Gui.prototype.set = function(G) {
    this.deck.set(G);
    this.table.set(G);
    var flash = false;
    for (var i = 0; i < this.hands.length; i++) {
        this.hands[i].set(G);
        if (G.flash[i].length) flash = true;
    }
    if (flash) {
        var self = this;
        setTimeout(function() { self.reset(G); }, 800);
    }
}
Gui.prototype.reset = function(G) {
    for (var i = 0; i < G.hands.length; i++) G.flash[i] = [];
    for (var i = 0; i < G.hands.length; i++) this.hands[i].set(G);
}

function GuiDeck(at) {
    this.span = document.createElement('span');
    this.span.style.display = 'inline-block';
    this.span.style.position = 'relative';
    this.span.style.width = '126px';
    this.span.style.height = '96px';
    at.appendChild(this.span);
}
GuiDeck.prototype.set = function(G) {
    var c = G.deck.A[35];
    var p = 36 - G.left;
    var tr = suit(c);
    var span;
    this.span.innerHTML = '';
    if (p > 34) {
        span = card(-1);
        span.style.position = 'absolute';
        span.style.top = '0';
        span.style.left = '0';
        this.span.appendChild(span);
    }
    if (p > 35) {
        span = cardh(-1);
        span.style.position = 'absolute';
        span.style.top = '13px';
        span.style.left = '30px';
        span.style.textAlign = 'center';
        span.style.lineHeight = '71px';
        span.style.fontSize = '48px';
        span.style.color = tr % 2 ? '#fa8' : '#fff';
        span.innerHTML = '\u2663\u2666\u2660\u2665'[tr];
        this.span.appendChild(span);
    }
    if (p <= 35) {
        span = cardh(c);
        span.style.position = 'absolute';
        span.style.top = '13px';
        span.style.left = '30px';
        this.span.appendChild(span);
    }
    if (p <= 34) {
        span = backv(0);
        span.style.position = 'absolute';
        span.style.top = '0';
        span.style.left = '0';
        span.title = (name(G.deck.card(p)));
        this.span.appendChild(span);
    }
}


function GuiTable(at) {
    this.span = document.createElement('span');
    this.span.style.display = 'inline-block';
    this.span.style.position = 'relative';
    this.span.style.width = '600px';
    this.span.style.height = '300px';
    at.appendChild(this.span);
}
GuiTable.prototype.set = function(G) {
    var i, c;
    this.span.innerHTML = '';
    for (i = 0; i < G.table.length; i++) {
        c = card(G.table[i][0]);
        c.style.position = 'absolute';
        c.style.top = '100px';
        c.style.left = (i * 120) + 'px';
        this.span.appendChild(c);
        if (G.table[i].length > 1) {
            c = card(G.table[i][1]);
            c.style.position = 'absolute';
            c.style.top = '70px';
            c.style.left = (30 + i * 120) + 'px';
            this.span.appendChild(c);
        }
    }
}

var arrows = { left: '\u21d0', up: '\u21d1', right: '\u21d2', down: '\u21d3', none: '&nbsp;' };
function Arrow() {
    var k, x;
    this.span = document.createElement('span');
    for (k of Object.keys(arrows)) {
        x = document.createElement('span');
        x.style.display = 'inline-block';
        x.style.width = '20px';
        x.style.height = '20px';
        x.style.fontSize = '20px';
        x.style.color = '#fff';
        x.innerHTML = arrows[k];
        this[k] = x;
        this.span.appendChild(x);
    }
}
Arrow.prototype.set = function(s) {
    for (var k of Object.keys(arrows)) this[k].style.display = k == s ? 'inline-block' : 'none';
}

function GuiHand(at) {
    this.span = document.createElement('span');
    this.span.style.display = 'inline-block';
    this.span.style.position = 'relative';
    this.stat = document.createElement('div');
    this.stat.style.fontSize = '20px';
    this.stat.style.color = '#fff';
    this.arrow = new Arrow();
    this.stat.appendChild(this.arrow.span);
    this.span.appendChild(this.stat);
    this.cards = document.createElement('div');
    this.cards.style.position = 'relative';
    this.cards.style.height = '120px';
    this.span.appendChild(this.cards);
    at.appendChild(this.span);
}
GuiHand.prototype.set = function(G) {
    var i, c, v;
    var x = 0;
    var y0 = '20px';
    var y1 = '10px';
    this.cards.innerHTML = '';
    for (i = 0; i < G.hands[0].length; i++) {
        v = G.hands[0][i];
        c = card(v);
        c.style.position = 'absolute';
        c.style.top = '20px';
        c.style.left = x + 'px';
        if (valid(G, 0, v)) {
            c.style.top = '10px';
            events(c, G, 0, v);
        }
        this.cards.appendChild(c);
        x += 80;
    }
    x += 20;
    v = valid(G, 0, -1);
    c = card(-1);
    c.style.position = 'absolute';
    c.style.top = '20px';
    c.style.left = x + 'px';
    if (valid(G, 0, -1)) {
        c.style.top = '10px';
        events(c, G, 0, -1);
    }
    this.cards.appendChild(c);
    x += WIDTH;
    this.span.style.width = x + 'px';
    this.arrow.set(G.att == 0 ? 'up' : G.def == 0 ? 'down' : 'none');
}

function GuiBack(n, at) {
    this.n = n;
    this.span = document.createElement('span');
    this.span.style.display = 'inline-block';
    this.span.style.position = 'relative';
    this.span.style.marginLeft = '20px';
    this.span.style.marginRight = '20px';
    this.cards = document.createElement('div');
    this.cards.style.height = '100px';
    this.span.appendChild(this.cards);
    this.stat = document.createElement('div');
    this.stat.style.fontSize = '20px';
    this.stat.style.color = '#fff';
    this.arrow = new Arrow();
    this.stat.appendChild(this.arrow.span);
    this.span.appendChild(this.stat);
    at.appendChild(this.span);
}
GuiBack.prototype.set = function(G) {
    this.cards.innerHTML = '';
    var i, c;
    for (i = 0; i < G.hands[this.n].length; i++) {
        if (G.flash[this.n].indexOf(G.hands[this.n][i]) != -1) continue;
        c = backv();
        c.title = name(G.hands[this.n][i]);
        this.cards.appendChild(c);
    }
    for (i = 0; i < G.flash[this.n].length; i++) {
        c = card(G.flash[this.n][i]);
        c.title = name(G.flash[this.n][i]);
        this.cards.appendChild(c);
    }
    this.arrow.set(G.att == this.n ? 'down' : G.def == this.n ? 'up' : 'none');
}

function GuiBackL(n, at) {
    this.n = n;
    this.span = document.createElement('span');
    this.span.style.display = 'inline-block';
    this.span.style.marginTop = '20px';
    this.span.style.marginBottom = '20px';
    this.cards = document.createElement('div');
    this.cards.style.display = 'inline-block';
    this.cards.style.width = '96px';
    this.span.appendChild(this.cards);
    this.stat = document.createElement('div');
    this.stat.style.display = 'inline-block';
    this.stat.style.verticalAlign = 'top';
    this.stat.style.width = '24px';
    this.stat.style.fontSize = '20px';
    this.stat.style.color = '#fff';
    this.arrow = new Arrow();
    this.stat.appendChild(this.arrow.span);
    this.span.appendChild(this.stat);
    at.appendChild(this.span);
}
GuiBackL.prototype.set = function(G) {
    this.cards.innerHTML = '';
    var i, c;
    for (i = 0; i < G.hands[this.n].length; i++) {
        if (G.flash[this.n].indexOf(G.hands[this.n][i]) != -1) continue;
        c = backh();
        c.title = name(G.hands[this.n][i]);
        this.cards.appendChild(c);
    }
    for (i = 0; i < G.flash[this.n].length; i++) {
        c = cardh(G.flash[this.n][i]);
        c.title = name(G.flash[this.n][i]);
        this.cards.appendChild(c);
    }
    this.stat.style.lineHeight = (this.cards.clientHeight || 100) + 'px';
    this.arrow.set(G.att == this.n ? 'right' : G.def == this.n ? 'left' : 'none');
}

function GuiBackR(n, at) {
    this.n = n;
    this.span = document.createElement('span');
    this.span.style.display = 'inline-block';
    this.span.style.marginTop = '20px';
    this.span.style.marginBottom = '20px';
    this.stat = document.createElement('div');
    this.stat.style.display = 'inline-block';
    this.stat.style.verticalAlign = 'top';
    this.stat.style.width = '24px';
    this.stat.style.fontSize = '20px';
    this.stat.style.color = '#fff';
    this.arrow = new Arrow();
    this.stat.appendChild(this.arrow.span);
    this.span.appendChild(this.stat);
    this.cards = document.createElement('div');
    this.cards.style.display = 'inline-block';
    this.cards.style.width = '96px';
    this.span.appendChild(this.cards);

    at.appendChild(this.span);
}
GuiBackR.prototype.set = function(G) {
    this.cards.innerHTML = '';
    var i, c;
    for (i = 0; i < G.hands[this.n].length; i++) {
        if (G.flash[this.n].indexOf(G.hands[this.n][i]) != -1) continue;
        c = backh();
        c.title = name(G.hands[this.n][i]);
        this.cards.appendChild(c);
    }
    for (i = 0; i < G.flash[this.n].length; i++) {
        c = cardh(G.flash[this.n][i]);
        c.title = name(G.flash[this.n][i]);
        this.cards.appendChild(c);
    }
    this.stat.style.lineHeight = (this.cards.clientHeight || 100) + 'px';
    this.arrow.set(G.att == this.n ? 'left' : G.def == this.n ? 'right' : 'none');
}

function valid(G, h, c) {
    var a, x;
    //console.log(h, c, G.att);
    if (h != G.turn) return false;
    if (h == G.att) {
        if (!G.table.length) return c != -1;
        for (a of G.table) for (x of a) if (rank(x) == rank(c)) return true;
        return c == -1;
    }
    if (h == G.def) {
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
    if (c == -1) s += h == G.def ? ' takes.' : ' done.';
    else s += ' plays ' + name(c);
    alert(s);
    if (c != -1) G.hands[h].splice(G.hands[h].indexOf(c), 1);
    if (h == G.def) {
        if (c != -1) G.table[G.table.length - 1].push([c]);
    }
    else {
        if (c != -1) G.table.push([c]);
        G.turn = G.def;
    }
    G.update();
    G.loop();
}

function events(x, G, h, c) {
    x.addEventListener('mouseover', function() { x.style.top = '0px' });
    x.addEventListener('mouseout', function() { x.style.top = '10px' });
    x.addEventListener('click', function() { play(G, h, c); });
}