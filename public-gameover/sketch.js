let socket = io("http://localhost:5050", { path: '/real-time' })
let canvas;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    background(0, 0, 0);
}

let Points;
const NumPoints = document.getElementById('NumPoints');

    socket.on('Final-Points', msn => {
        console.log(msn);
        Points = msn;
        NumPoints.innerHTML = Points;
        }
    )

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
