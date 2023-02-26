const URL = `http://${window.location.hostname}:5050`;
let socket = io("http://localhost:5050", { path: '/real-time' })
let canvas;

let controllerX = 0;
let controllerY = 0;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '2');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    background(255);
    frameRate(16);
    controllerX = windowWidth / 2;
    controllerY = windowHeight / 2;
}

let UP;
let RIGHT;
let LEFT;

function preload(){
    UP = loadImage('./Images/JumpButton.png');
    RIGHT = loadImage ('./Images/ArrowDerButton.png');
    LEFT = loadImage ('./Images/ArrowIzqButton.png');
}

function draw() {
    fill(255, 0, 0);
    image (UP, windowWidth / 5, windowHeight / 2 - windowWidth/10, windowWidth/5, windowWidth/5);  

    fill(255, 0, 0);
    image (LEFT, windowWidth / 2, windowHeight / 2 - windowWidth/20, windowWidth/14, windowWidth/10);

    fill(255, 0, 0);
    image (RIGHT, 3 * windowWidth / 4, windowHeight / 2 - windowWidth/20, windowWidth/14, windowWidth/10);
    
    movementButton('UP', windowWidth / 5, windowHeight / 2 - windowWidth/10);
    movementButton('LEFT', windowWidth / 2, windowHeight / 2 - windowWidth/20);
    movementButton('RIGHT', 3 * windowWidth / 4, windowHeight / 2 - windowWidth/20);
}

function movementButton(){

    let msn = "";

    switch(true){
        case (dist(pmouseX, pmouseY, windowWidth / 5 + windowWidth / 10, windowHeight / 2) < 150):
            msn = 'UP';
            console.log("up");
            break;

        case (dist(pmouseX, pmouseY,  windowWidth / 2 + windowWidth/28, windowHeight / 2 - windowWidth/20) < 100):
            msn = 'LEFT';
            console.log("left");
            break;

        case (dist(pmouseX, pmouseY,  3 * windowWidth / 4 + windowWidth/28, windowHeight / 2) < 100):
            msn = 'RIGHT';
            
            console.log("right");
            break;
    }

    if (msn !== '') {
        socket.emit('Instructions', msn);
      }
}
