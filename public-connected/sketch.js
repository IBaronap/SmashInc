let socket = io("http://localhost:5050", { path: '/real-time' })
let canvas;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    background(0);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


socket.on('switch', (msn) => {
    window.location.href = msn;
 });