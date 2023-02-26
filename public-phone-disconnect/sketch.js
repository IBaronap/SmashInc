let socket = io("http://localhost:5050", { path: '/real-time' })
let canvas;
let controllerX, controllerY = 0;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    background(0);
}

function draw() {
}

let Points;

    socket.on('Final-Points', msn => {
        console.log(msn);
        Points = msn;
        }
    )

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}