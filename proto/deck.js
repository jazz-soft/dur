const WIDTH = 71;
const HEIGHT = 96;

function card() {
    var span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.backgroundColor = 'red';
    span.style.width = WIDTH + 'px';
    span.style.height = HEIGHT + 'px';
    span.style.backgroundImage = 'url("cards.png")';
    return span;
}