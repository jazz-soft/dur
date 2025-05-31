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
    span.style.backgroundColor = 'red';
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
    span.style.backgroundColor = 'red';
    span.style.width = HEIGHT + 'px';
    span.style.height = WIDTH + 'px';
    span.style.backgroundImage = 'url("cardsh.png")';
    span.style.backgroundPositionX = (-x * HEIGHT) + 'px';
    span.style.backgroundPositionY = (-y * WIDTH) + 'px';
    return span;
}

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
    span.style.backgroundColor = 'red';
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
    span.style.backgroundColor = 'red';
    span.style.width = HEIGHT + 'px';
    span.style.height = WIDTH + 'px';
    span.style.backgroundImage = 'url("cardsh.png")';
    span.style.backgroundPositionX = (-x * HEIGHT) + 'px';
    span.style.backgroundPositionY = (-y * WIDTH) + 'px';
    return span;
}

function Deck() { this.A = [...Array(36).keys()]; }
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