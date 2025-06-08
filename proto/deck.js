const WIDTH = 71;
const HEIGHT = 96;

function card(n) {
    var x = 12;
    var y = 4;
    if (n >= 0 && n < 36) {
        x = [5, 6, 7, 8, 9, 10, 11, 12, 0][n % 9];
        y = [0, 1, 3, 2][Math.floor(n / 9)];
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
        x = [5, 4, 2, 3][Math.floor(n / 9)];
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
function value(n) { return n % 9; }

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
    k = 0;
    for (i = 0; i < this.players; i++) {
        this.hands[i] = this.deck.A.slice(k, k + 6);
        this.hands[i].sort(compare);
        k += 6;
    }
    this.left = 36 - k;
    n = opt.turn;
    if (n != parseInt(n) || n < 0 || n >= this.players) n = first(this);
    this.turn = n;
    this.round = n;
    this.gui = [];
}

function first(X) {
    var i, j, k, n = 0, m = 99;
    for (i = 0; i < X.players; i++) {
        for (j = 0; j < 6; j++) {
            k = X.hands[i][j];
            if (suit(k) != X.trump || k > m) continue;
            m = k;
            n = i;
            break;
        }
    }
    return n;
}

function compare(a, b) { return a - b; }

function Gui(at) {
    var div = document.createElement('div');
    this.div = div;
    div.style.display = 'inline-block';
    div.style.width = '100%';
    //div.style.backgroundColor = 'red';
    div.style.position = 'relative';
    div.innerHTML = '*';
    document.body.appendChild(div);
}
Gui.prototype.init = function(G) {
    this.div.innerHTML = '';
    this.deck = new GuiDeck(this.div);
    this.set(G);
}
Gui.prototype.set = function(G) {
    this.deck.set(G.left, G.deck.A[35]);
}

function GuiDeck(at) {
    var span = document.createElement('span');
    this.span = span;
    span.style.display = 'inline-block';
    //span.style.backgroundColor = 'yellow';
    span.style.position = 'relative';
    span.style.width = '126px';
    span.style.height = '96px';
    at.appendChild(span);
}
GuiDeck.prototype.set = function(n, c) {
    if (!this.bottom) {
        this.bottom = cardh(c);
        this.bottom.style.position = 'absolute';
        this.bottom.style.top = '13px';
        this.bottom.style.left = '30px';
        this.span.appendChild(this.bottom);
    }
    if (!this.back) {
        this.back = backv(0);
        this.back.style.position = 'absolute';
        this.back.style.top = '0';
        this.back.style.left = '0';
        this.span.appendChild(this.back);
    }
    if (!this.trump) {
        this.trump = document.createElement('span');
        this.trump.style.display = 'inline-block';
        this.trump.style.position = 'absolute';
        this.trump.style.top = '0';
        this.trump.style.left = '0';
        this.trump.style.width = '126px';
        this.trump.style.height = '96px';
        this.trump.style.textAlign = 'center';
        this.trump.style.lineHeight = '96px';
        this.trump.style.fontSize = '48px';
        this.trump.style.color = '#fa8';
        this.trump.innerHTML = '\u2660';
        //this.span.appendChild(this.trump);
    }
}