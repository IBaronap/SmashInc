const NGROK = `${window.location.hostname}`;
console.log('Server IP: ', NGROK);
let socket = io(NGROK, { path: '/real-time' });
///Aqui voy, falta terminar cambios para que coja el Ngrok (esta es la única pantalla que lo tiene)
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