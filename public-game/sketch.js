let socket = io("http://localhost:5050", { path: '/real-time' })

let canvas;

function setup() {
    canvas = createCanvas(850, 1253);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    background(255);
    
    Plat = new Platforms();
    End = new Fin ();
    Enemy = new Item();
}

function draw() {
    // keyPressed ();
    gravity ();
    game ();
    points();

    noStroke();
    fill(255);
    textSize(40);
    text(Points, 425, 75)
  }

function windowResized() {
    resizeCanvas(850, 1253);
}

//Controllers
let controllerX, controllerY = 0;

//Image loads

let player;
let stand;
let canon;
let canonL;
let spikes;
let stuff;
let floor;
let back;

function preload (){
  player = loadImage('./Images/Mario.png');
  stand = loadImage ('./Images/Platform.png');
  canon = loadImage ('./Images/Canon.png');
  canonL = loadImage ('./Images/Canon2.png');
  spikes = loadImage ('./Images/Spikes.png');
  stuff = loadImage('./Images/Stuff.png');
  floor = loadImage('./Images/Floor.png');
  back = loadImage('./Images/Background.png')
}

//Max and Min coordinates

var minh = 1070;
var maxh = 0;
var minw = 0;
var maxw = 780;

//Player

var Playerx = 412;
var Playery = minh;
var PlayerWidth = 100;
var PlayerHeight = 150;

    //Movement

    // function keyPressed (){
    //     if (keyIsDown(LEFT_ARROW) && (Playerx > 40)) {
    //     Playerx -= 5;
    // };
    // if (keyIsDown(RIGHT_ARROW) && (Playerx < 920)) {
    //     Playerx += 5;
    // };
    // if (keyIsDown(UP_ARROW)) {
    //     jump = true;
    // }
    // else{
    //     jump = false;
    // }
    // }; 

    socket.on('Move-Player', msn => {
        console.log(msn);
        let{} = msn;
        switch(msn){
            case 'LEFT':
                if (Playerx <= maxw) {
                       Playerx += 5;
                    };
                break;

            case 'RIGHT':
                if (Playerx >= minw) {
                       Playerx -= 5;
                    };
                break;

            case 'UP':
                jump = true;
                break;
            default:
                jump = false;
                break;
        }
    })

    //Variables for jumping and gravity

    var jump = false;
    var direction = 1;
    var velocity = 3;
    var jumppower = 13;
    var falling = 5;
    var jumpcounter = 0;

    //Gravity and Jump

    function gravity (){
    if (Playery >= minh && jump == false){
        Playery = Playery;
        jumpcounter = 0;
    }
    else{
        Playery = Playery + (direction*velocity);
    }
    
    if (jump == true){
        if (Playery <= maxh || jumpcounter >= jumppower){
        if (Playery >= minh){
            Playery = minh;
        }
        else{
        velocity = falling;   
        }
        }
        else {
        velocity = -jumppower;
        jumpcounter = jumpcounter + 1;
        }
    }
    else {
        velocity = falling;
    }
    };

//Juego SetUp

function game (){
    image (back, -5, 0, width+5, height);
    image (stuff, 20, minh, 0, 0);

    End.drawEnd();
    Enemy.Spike();
    Enemy.CanonR();
    Enemy.CanonL();

    image (player, Playerx, Playery, PlayerWidth, PlayerHeight);

    Plat.paint();
    Plat.collision();

    End.end();
}

//Plataforms

    //Class Platforms & collision cases
    
    let Plats = [];
    const numPlatforms = 10;
    const PlatSize = 20;

    class Platforms {
    constructor(){

        for (let i = 0; i < numPlatforms; i++){
            const x = Math.floor(Math.random() * (width));
            const y = Math.floor(Math.random() * (height));
            Plats.push({x, y});
        }
    };

    paint(){
        image (floor, 0, 1210, width, 50);

        for (let i = 0; i < Plats.length; i++) {
            const {x, y} = Plats[i];
            image(stand, x, y, 140, 40)
        };
    };

    collision(){

        for (let i = 0; i < Plats.length; i++) {
            const {x, y} = Plats[i];
            const platformWidth = 140;
            const platformHeight = 40;

            if (Playerx >= x - platformWidth/2 + 20 && Playerx <= x + platformWidth/2 + 20 && Playery + 120 >= y - platformHeight/2 && Playery + 120 < y + platformHeight && jump == false) {
                Playery= Playery;
                velocity = 0 
                jumpcounter = 0;
                break;
            }
            }
        }
    };
  
  //Enemies
  
  let fallingSpikes = [];
  let CanonsRight = [];
  let CanonsLeft = [];

  class Item {
    constructor() {
      this.position = [random(0,800), minh + 80];
    }
    Spike() {
        if (random(1) < 0.0025) {
            let imgObj = {
                img: spikes,
                x: random(width),
                y: random(-200, -100),
                speed: random(1, 3),
                width: 50,
                height: 50,
            };
            fallingSpikes.push(imgObj);
        }
        for (let i = 0; i < fallingSpikes.length; i++) {
            let imgObj = fallingSpikes[i];
            imgObj.y += imgObj.speed;
            image(imgObj.img, imgObj.x, imgObj.y);

            let d = dist(imgObj.x + imgObj.width/2, imgObj.y + imgObj.height/2, Playerx, Playery);
            if (d < imgObj.width/2 + 25) { 
                GameOver();
            }
        }      
    };
    CanonR() {
        if (random(1) < 0.0025) {
            let imgObj = {
                img: canon,
                x: random(800, 1000),
                y: random(height),
                speed: random(3, 5),
                width: 50,
                height: 50,
            };
            CanonsRight.push(imgObj);
        }
        for (let i = 0; i < CanonsRight.length; i++) {
            let imgObj = CanonsRight[i];
            imgObj.x -= imgObj.speed;
            image(imgObj.img, imgObj.x, imgObj.y);

            let d = dist(imgObj.x + imgObj.width/2, imgObj.y + imgObj.height/2, Playerx, Playery);
            if (d < imgObj.width/2 + 50) { 
                GameOver();
            }
          }
    };
    CanonL() {
        if (random(1) < 0.0025) {
            let imgObj = {
                img: canonL,
                x: random(-200, -100),
                y: random(height),
                speed: random(3, 5),
                width: 50,
                height: 50,
            };
            CanonsLeft.push(imgObj);
        }
        for (let i = 0; i < CanonsLeft.length; i++) {
            let imgObj = CanonsLeft[i];
            imgObj.x += imgObj.speed;
            image(imgObj.img, imgObj.x, imgObj.y);

            let d = dist(imgObj.x + imgObj.width/2, imgObj.y + imgObj.height/2, Playerx, Playery);
            if (d < imgObj.width/2 + 50) { 
                GameOver();
            }
          }
    };
  };

 //Points

 let time = 0;
 let Points = 0;

 function points(){
    time++;
    if (time % 60 == 0) {
        Points++;
    }

    if (time > (60 * 60)) {
        GameOver();
    }
 }
 
 //Game over

class Fin {
    constructor() {
      this.position = [0, 0];
    };
    drawEnd() {
      stroke(10, 170, 10);
      strokeWeight(10);
      fill(63, 191, 255);
      rect(this.position[0], this.position[1], width, 5);
    };
    end() {
      if (Playery == this.position[1]) {
        GameOver();
      };
    };
  };

 function GameOver(){
        console.log('Game Over');
        msn = Points;
        socket.emit('Points', msn);

        time = 0;
        Points = 0;

        alert("Game over!");
        Playerx = 412;
        Playery = minh;
        console.clear();

        fallingSpikes.length = 0;
        CanonsRight.length = 0;
        CanonsLeft.length = 0;
 }
