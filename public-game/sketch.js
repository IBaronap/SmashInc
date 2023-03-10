const NGROK = `${window.location.hostname}`;
console.log('Server IP: ', NGROK);
let socket = io(NGROK, { path: '/real-time' });

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
    gravity ();
    game ();
    points();

    stroke(255);
    fill(255);
    textSize(50);
    text(Points, 760, 75)
  }

function windowResized() {
    resizeCanvas(850, 1253);
}

//Juego SetUp

function game (){
    image (back, -5, 0, width+5, height);
    image (stuff, 20, minh, 0, 0);

    image (player, Playerx, Playery, PlayerWidth, PlayerHeight);

    End.drawEnd();
    Enemy.Spike();
    Enemy.CanonR();
    Enemy.CanonL();

    Plat.paint();
    Plat.collision();

    End.end();
}

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

        socket.on('Move-Player', msn => {
            console.log(msn);
            let{} = msn;
            switch(msn){
                case 'LEFT':
                    if (Playerx >= minw) {
                        Playerx -= 10;
                       };
                    break;

                case 'RIGHT':
                    if (Playerx <= maxw) {
                        Playerx += 10;
                        };
                    break;

                case 'UP':
                    if (!jump) {
                        jump = true;
                        setTimeout(() => {jump = false;}, 500);
                      }
                    break;
            }
        })

    //Variables for jumping and gravity

    var jump = false;
    var direction = 1;
    var velocity = 3;
    var jumppower = 15;
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

    //Plataforms

    //Class Platforms & collision cases
    
    let Plats = [];
    const numPlatforms = 10;
    const PlatSize = 20;

    class Platforms {
    constructor(){

        //10 platforms at random positions

        for (let i = 0; i < numPlatforms; i++){

            let overlap = true;
            let x, y;
            while(overlap){
                x = Math.floor(Math.random() * (minw + 70, maxw - 70));
                y = Math.floor(Math.random() * (1100));
                
                //So the platforms dont appear one on top of the other
                overlap = false;
                for (let j = 0; j < Plats.length; j++) {
                    const platform = Plats[j];
                    if (x + 200 > platform.x && x < platform.x + 200 && y + 100 > platform.y && y < platform.y + 100 && jump == false) {
                      overlap = true;
                      break;
                    }
                }
            }
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

    //Collision (hitbox of platforms)

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
            constructor() {}
            Spike() {
                if (random(1) < 0.003) {
                    let imgObj = {
                        img: spikes,
                        x: random(minw, maxw),
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

                    //Collision
                    let d = dist(imgObj.x + imgObj.width/2, imgObj.y + imgObj.height/2, Playerx, Playery);
                    if (d < imgObj.width/2 + 40) { 
                        GameOver();
                    }
                }      
            };
            CanonR() {
                if (random(1) < 0.003) {
                    let imgObj = {
                        img: canon,
                        x: random(800, 1000),
                        y: random(maxh, minh),
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
                    if (d < imgObj.width/2 + 25) { 
                        GameOver();
                    }
                }
            };
            CanonL() {
                if (random(1) < 0.003) {
                    let imgObj = {
                        img: canonL,
                        x: random(-200, -100),
                        y: random(maxh, minh),
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
                    if (d < imgObj.width/2 + 25) { 
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
            noStroke();
            fill(0, 215, 255);
            rect(this.position[0], this.position[1], width, 10);
        };
        end() {
        if (Playery == this.position[1]) {
            Points = 60;
            GameOver();
        };
        };
    };

        function GameOver(){
            console.log('Game Over');
            msn = Points;
            change = '/phone-gameover';
            
            //If switchPage is emited first, the points are not emited
            socket.emit('switchPage', change);
            //Even if the points do send, the pages will recharge and erase the message that they received
            socket.emit('Points', msn);
            
            window.location.href = '/mupi-gameover';
        
            //Restart
            time = 0;
            Points = 0;

            
            Playerx = 412;
            Playery = minh;
            console.clear();

            fallingSpikes.length = 0;
            CanonsRight.length = 0;
            CanonsLeft.length = 0;
        }
