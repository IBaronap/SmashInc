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
    background(0);

    
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
    ellipse(windowWidth / 2, windowHeight / 3, 50, 50);
    
    fill(255, 0, 0);
    ellipse(windowWidth / 3, windowHeight / 2, 50, 50);
    
    fill(255, 0, 0);
    ellipse(windowWidth / 1.5, windowHeight / 2, 50, 50);   

    
    movementButton('UP', windowWidth / 2, windowHeight / 3);
    movementButton('RIGHT', windowWidth / 3, windowHeight / 2);
    movementButton('LEFT', windowWidth / 1.5, windowHeight / 2);
}

function movementButton(){

    let msn = "";

    switch(true){
        case (dist(pmouseX, pmouseY, windowWidth / 2, windowHeight / 3) < 25):
            msn = 'UP';
            console.log("up");
            break;

        case (dist(pmouseX, pmouseY,  windowWidth / 1.5, windowHeight / 2) < 25):
            msn = 'LEFT';
            console.log("left");
            break;

        case (dist(pmouseX, pmouseY,  windowWidth / 3, windowHeight / 2) < 25):
            msn = 'RIGHT';
            
            console.log("right");
            break;
    }

    if (msn !== '') {
        socket.emit('Instructions', msn);
      }
}
