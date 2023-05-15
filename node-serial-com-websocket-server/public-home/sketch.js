// General
const NGROK = `${window.location.hostname}`;
console.log('Server IP: ', NGROK);

let socket = io(NGROK, { path: '/real-time' })
let canvas;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

//Arduino msn

socket.on('arduinoMessage', (arduinoMessage) => { //Recibe mensaje arduino
    console.log(arduinoMessage);
    let { actionA, actionB, signal } = arduinoMessage;

    ArduinoBTNClicked(actionB); //Para cambio de pantallas
    BTNSounds(actionA); //Cambia el sonido del boton si esta en instrucciones o en el juego
    moveJump([actionA, signal]); //Mov. salto
    moveX([actionB, signal]); //Mov. Joystick
})

function ArduinoBTNClicked(actionB){
    if (actionB == 'A') {
        if(screen == 1){ //From Home to Instructions 1
            screen = 2;
            switchScreen();
        }
        else if(screen == 2){ //From Instructions 1 to Instructions 2
            screen = 3;
            switchScreen();
        }
        
        else if(screen == 3){ //From Instructions 2 to Game
            screen = 4;
            switchScreen();
        }
    
        //From Game to Gameover is when the player finishes the game
        
        else if(screen == 5){//From Gameover to QR
            screen = 6;
            switchScreen();
        }
    
        //From QR to Waiting is when the QR is read on the phone
        //From Waiting to End is when the form is sent on the phone
        //From End to Home is when the phone is disconnected
    }
}

//Switch Screens

    let screen = 1;
    let switchMSN;

    //Para cambiar pantalla haciendo click al qR (ahora cambie es con el celular)
    document.getElementById('QR').addEventListener('click', () => { /*Cambiar id del QR para que cambie de screen */
        screen = 2;
        switchScreen();
    });

    socket.on('switch', (msn) => { //Recibe mensaje de cambiar pantalla desde el celular
        screen = msn;
        switchScreen();
    });

    function switchScreen() {
            switch(screen) {
                case 1: //Home
                    document.getElementById('Home').style.display = 'block';
                    document.getElementById('Connected').style.display = 'none';
                    document.getElementById('Instructions').style.display = 'none';
                    document.getElementById('Game').style.display = 'none';
                    document.getElementById('Gameover').style.display = 'none';
                    document.getElementById('QRScreen').style.display = 'none';
                    document.getElementById('Formulario').style.display = 'none';
                    document.getElementById('Disconnect').style.display = 'none';
                    break;
                case 2: //Instructions 1 
                    document.getElementById('Home').style.display = 'none';
                    document.getElementById('Connected').style.display = 'block';
                    document.getElementById('Instructions').style.display = 'none';
                    document.getElementById('Game').style.display = 'none';
                    document.getElementById('Gameover').style.display = 'none';
                    document.getElementById('QRScreen').style.display = 'none';
                    document.getElementById('Formulario').style.display = 'none';
                    document.getElementById('Disconnect').style.display = 'none';
                    break;
                case 3: //Instructions 2
                    document.getElementById('Home').style.display = 'none';
                    document.getElementById('Connected').style.display = 'none';
                    document.getElementById('Instructions').style.display = 'block';
                    document.getElementById('Game').style.display = 'none';
                    document.getElementById('Gameover').style.display = 'none';
                    document.getElementById('QRScreen').style.display = 'none';
                    document.getElementById('Formulario').style.display = 'none';
                    document.getElementById('Disconnect').style.display = 'none';
                    break;
                case 4: //Game
                    document.getElementById('Home').style.display = 'none';
                    document.getElementById('Connected').style.display = 'none';
                    document.getElementById('Instructions').style.display = 'none';
                    document.getElementById('Game').style.display = 'block';
                    document.getElementById('Gameover').style.display = 'none';
                    document.getElementById('QRScreen').style.display = 'none';
                    document.getElementById('Formulario').style.display = 'none';
                    document.getElementById('Disconnect').style.display = 'none';
                    Restart();
                    socket.emit('orderForArduino','G'); //Para musica de inicio del juego
                    break;
                case 5: //Gameover
                    document.getElementById('Home').style.display = 'none';
                    document.getElementById('Connected').style.display = 'none';
                    document.getElementById('Instructions').style.display = 'none';
                    document.getElementById('Game').style.display = 'none';
                    document.getElementById('Gameover').style.display = 'block';
                    document.getElementById('QRScreen').style.display = 'none';
                    document.getElementById('Formulario').style.display = 'none';
                    document.getElementById('Disconnect').style.display = 'none';
                    socket.emit('orderForArduino','O'); //Para musica de final del juego
                    break;
                case 6: //QR
                    document.getElementById('Home').style.display = 'none';
                    document.getElementById('Connected').style.display = 'none';
                    document.getElementById('Instructions').style.display = 'none';
                    document.getElementById('Game').style.display = 'none';
                    document.getElementById('Gameover').style.display = 'none';
                    document.getElementById('QRScreen').style.display = 'block';
                    document.getElementById('Formulario').style.display = 'none';
                    document.getElementById('Disconnect').style.display = 'none';
                    break;
                case 7: //Waiting for formulario
                    document.getElementById('Home').style.display = 'none';
                    document.getElementById('Connected').style.display = 'none';
                    document.getElementById('Instructions').style.display = 'none';
                    document.getElementById('Game').style.display = 'none';
                    document.getElementById('Gameover').style.display = 'none';
                    document.getElementById('QRScreen').style.display = 'none';
                    document.getElementById('Formulario').style.display = 'block';
                    document.getElementById('Disconnect').style.display = 'none';
                    break;
                case 8: //End
                    document.getElementById('Home').style.display = 'none';
                    document.getElementById('Connected').style.display = 'none';
                    document.getElementById('Instructions').style.display = 'none';
                    document.getElementById('Game').style.display = 'none';
                    document.getElementById('Gameover').style.display = 'none';
                    document.getElementById('QRScreen').style.display = 'none';
                    document.getElementById('Formulario').style.display = 'none';
                    document.getElementById('Disconnect').style.display = 'block';
                    break;
                default:
                    console.log('Screen does not exist');
              }        
        };

 //Game

    function setup() {
        canvas = createCanvas(850, 1253);
        canvas.style('z-index', '-1');
        canvas.style('position', 'fixed');
        canvas.style('top', '0');
        canvas.style('left', '0');
        canvas.parent("Game");
        background(255);
        
        Plat = new Platforms();
        End = new Fin ();
        Enemy = new Item();
    }
    
    function draw() {
        if(screen === 4){

            //Game
            gravity ();
            game ();
            points();
            PointsChange();
    
            //Counter
            stroke(255);
            strokeWeight(8);
            fill(42, 75, 153, 90);
            circle(width/2, 100, 100, 100);

            stroke(0);
            strokeWeight(8);
            fill(255);
            textSize(40);
            textFont( 'MARIO_Font_v3_Solid')
            if (Points < 10) {
                text("0" + Points, width/2 - 30, 113);
            } else {
                text(Points, width/2 - 30, 113);
            }

            //Points
            fill(255);
            textSize(30);
            textFont( 'MARIO_Font_v3_Solid')
            text("Mario", 50, 83);

            fill(255);
            textSize(30);
            textFont( 'MARIO_Font_v3_Solid')
            if (Points < 1) {
                text("000" + Points*50, 50, 123);
            }else if (Points < 2) {
                text("00" + Points*50, 50, 123);
            }else if (Points < 20) {
                text("0" + Points*50, 50, 123);
            } else {
                text(Points*50, 50, 123);
            }
            
            //Lives
            fill(255);
            textSize(30);
            textFont( 'MARIO_Font_v3_Solid')
            text("x " + lives, 750, 83);

            //Gain/Loses points
            if(immunityCooldown){
                fill(255);
                textSize(30);
                textFont( 'MARIO_Font_v3_Solid')
                text("- 500", Playerx, Playery - 25);
            }

            if(IncreasePoints){
                fill(255);
                textSize(30);
                textFont( 'MARIO_Font_v3_Solid')
                text("+ 200", Playerx, Playery - 25);
            }

            if(DecreasePoints){
                fill(255);
                textSize(30);
                textFont( 'MARIO_Font_v3_Solid')
                text("- 200", Playerx, Playery - 25);
            }
        }
    }

    function windowResized() {
        resizeCanvas(850, 1253);
    }
   
    //Juego SetUp

    function game (){
        image (back, -5, 0, width+5, height);
        image (stuff2, 0, minh - 100, 0, 0);
        image (stuff, 20, minh, 0, 0);
        image (liveMushroom, 690, 50, 45, 45);

        let player;

        if (Newdirection == 'right' && !jump) {
            player = playerR;
        } else if (Newdirection == 'left' && !jump) {
            player = playerL;
        }     
            else if (Newdirection == 'right' && jump) {
                player = playerJumpR;
            } else if (Newdirection == 'left' && jump) {
                player = playerJumpL;
            }
            
        Playerx += dx;

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

    let playerR;
    let playerL;
    let playerJumpR;
    let playerJumpL;

    let stand;
    let canon;
    let canonL;
    let spikes;
    let stuff;
    let stuff2;
    let floor;
    let back;
    let liveMushroom;
    
    function preload (){
        playerR = loadImage('./Images/MarioR.png');
        playerL = loadImage('./Images/MarioL.png');
        playerJumpR = loadImage('./Images/MarioJ.png');
        playerJumpL = loadImage('./Images/MarioJL.png');

        stand = loadImage ('./Images/Platform.png');
        canon = loadImage ('./Images/Canon.png');
        canonL = loadImage ('./Images/Canon2.png');
        spikes = loadImage ('./Images/Spikes.png');
        stuff = loadImage('./Images/Stuff.png');
        stuff2 = loadImage('./Images/Stuff2.png');
        floor = loadImage('./Images/Floor.png');
        back = loadImage('./Images/Background.png');
        liveMushroom = loadImage('./Images/Live.png')
    }

    //BTN Sounds

    function BTNSounds(actionA){
        if (actionA == 'B') {
            if (screen == 4){ //Sonido de salto si está en el juego
                socket.emit('orderForArduino','J');
            }
            else if (screen == 1 || screen == 2 || screen == 3 || screen == 5){ //Sonido de continuar 
                socket.emit('orderForArduino','A');
            }
        }
    }

    //Max and Min coordinates

    var minh = 1070;    var maxh = 0;
    var minw = 0;       var maxw = 780;

    //Player

        var Playerx = 412;
        var Playery = minh;
        var PlayerWidth = 100;
        var PlayerHeight = 150;

        let Newdirection = 'right';
        let dx = 0;

            //Movement

            function moveX([direction, signal]) {
                if(direction[0] == 'X'){

                    switch(signal){
                        case 0:
                            if (Playerx >= minw) {
                                // Playerx -= 20;
                                dx = -2;
                                Newdirection = 'left';
                                socket.emit('orderForArduino','W'); //Sonido de caminar
                                };
                            break;
            
                        case 2:
                            if (Playerx <= maxw) {
                                // Playerx += 20;
                                dx = 2;
                                Newdirection = 'right';
                                socket.emit('orderForArduino','W'); //Sonido de caminar
                                };
                            break;
            
                        case 1:
                            dx = 0;
                            // Playerx = Playerx;
                            break;
                    }

                    // let mapXValue = (signal * 770) / 1023;
                    // Playerx = mapXValue;

                    // let XPosition = signal;
                    // let PreviousXPosition = XPosition;
                    // const threshold = 10;

                    // if (XPosition > PreviousXPosition + threshold) {
                    //     player = playerR;
                    //     image(player, Playerx, Playery, PlayerWidth, PlayerHeight);
                    //     PreviousXPosition = XPosition;
                    //   } else if (XPosition < PreviousXPosition - threshold) {
                    //         player = playerL;
                    //         image(player, Playerx, Playery, PlayerWidth, PlayerHeight);
                    //         PreviousXPosition = XPosition;
                    //     }
                }
            }

            function moveJump(direction, signal) {
                if (direction[0] == 'B') {
                    if (!jump) {
                        jump = true;
                        Newdirection = direction === 'left' ? 'left' : 'right';
                        setTimeout(() => {jump = false}, 100);
                    }
                }
            }

            // socket.on('Move-Player', msn => {
            //     console.log(msn);
            //     let{} = msn;
            //     switch(msn){
            //         case 'LEFT':
            //             if (Playerx >= minw) {

            //                 Playerx -= 10;
            //             };
            //             break;

            //         case 'RIGHT':
            //             if (Playerx <= maxw) {
            //                 player = playerR;
            //                 image(player, Playerx, Playery, PlayerWidth, PlayerHeight);

            //                 Playerx += 10;
            //                 };
            //             break;

            //         case 'UP':
            //             if (!jump) {
            //                 jump = true;
            //                 setTimeout(() => {
            //                     jump = false;
            //                 }, 500);
            //             }
            //             break;
            //     }
            // })

        //Variables for jumping and gravity

        var jump = false;
        var direction = 1;
        var velocity = 3;
        var jumppower = 25;
        var falling = 10;
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

        //Class Platforms & collision cases

        var Px1 = 500;  var Py1 = 1100;
        var Px2 = 325;  var Py2 = 1000;
        var Px3 = 475;  var Py3 = 875;
        var Px4 = 300;  var Py4 = 775;
        var Px5 = 150;  var Py5 = 650;
        var Px6 = 400;  var Py6 = 575;
        var Px7 = 200;  var Py7 = 450;
        var Px8 = 500;  var Py8 = 400;
        var Px9 = 300;  var Py9 = 300;
        var Px10 = 550; var Py10 = 200;
        var Px11 = 100; var Py11 = 200;
        var Px12 = 125; var Py12 = 900;

        class Platforms {
        constructor(){
            this.width = 200;
            this.height = 40;
        }
            paint(){
                image (floor, 0, 1210, width, 50);
                image(stand, Px1, Py1, this.width, this.height);
                image(stand, Px2, Py2, this.width, this.height);
                image(stand, Px3, Py3, this.width, this.height);
                image(stand, Px4, Py4, this.width, this.height);
                image(stand, Px5, Py5, this.width, this.height);
                image(stand, Px6, Py6, this.width, this.height);
                image(stand, Px7, Py7, this.width, this.height);
                image(stand, Px8, Py8, this.width, this.height);
                image(stand, Px9, Py9, this.width, this.height);
                image(stand, Px10, Py10, this.width, this.height);
                image(stand, Px11, Py11, this.width, this.height);
                image(stand, Px12, Py12, this.width, this.height);
              };

              collision(){
                if (   (Playerx >= Px1 - this.width/2 + 30 && Playerx <= Px1 + this.width/2 + 30 && Playery + 120 >= Py1 - this.height/2 && Playery + 120 < Py1 + this.height && jump == false)
                    || (Playerx >= Px2 - this.width/2 + 30 && Playerx <= Px2 + this.width/2 + 30 && Playery + 120 >= Py2 - this.height/2 && Playery + 120 < Py2 + this.height && jump == false)
                    || (Playerx >= Px3 - this.width/2 + 30 && Playerx <= Px3 + this.width/2 + 30 && Playery + 120 >= Py3 - this.height/2 && Playery + 120 < Py3 + this.height && jump == false)
                    || (Playerx >= Px4 - this.width/2 + 30 && Playerx <= Px4 + this.width/2 + 30 && Playery + 120 >= Py4 - this.height/2 && Playery + 120 < Py4 + this.height && jump == false)
                    || (Playerx >= Px5 - this.width/2 + 30 && Playerx <= Px5 + this.width/2 + 30 && Playery + 120 >= Py5 - this.height/2 && Playery + 120 < Py5 + this.height && jump == false)
                    || (Playerx >= Px6 - this.width/2 + 30 && Playerx <= Px6 + this.width/2 + 30 && Playery + 120 >= Py6 - this.height/2 && Playery + 120 < Py6 + this.height && jump == false)
                    || (Playerx >= Px7 - this.width/2 + 30 && Playerx <= Px7 + this.width/2 + 30 && Playery + 120 >= Py7 - this.height/2 && Playery + 120 < Py7 + this.height && jump == false)
                    || (Playerx >= Px8 - this.width/2 + 30 && Playerx <= Px8 + this.width/2 + 30 && Playery + 120 >= Py8 - this.height/2 && Playery + 120 < Py8 + this.height && jump == false)
                    || (Playerx >= Px9 - this.width/2 + 30 && Playerx <= Px9 + this.width/2 + 30 && Playery + 120 >= Py9 - this.height/2 && Playery + 120 < Py9 + this.height && jump == false)
                    || (Playerx >= Px10 - this.width/2 + 30 && Playerx <= Px10 + this.width/2 + 30 && Playery + 120 >= Py10 - this.height/2 && Playery + 120 < Py10 + this.height && jump == false)
                    || (Playerx >= Px11 - this.width/2 + 30 && Playerx <= Px11 + this.width/2 + 30 && Playery + 120 >= Py11 - this.height/2 && Playery + 120 < Py11 + this.height && jump == false)
                    || (Playerx >= Px12 - this.width/2 + 30 && Playerx <= Px12 + this.width/2 + 30 && Playery + 120 >= Py12 - this.height/2 && Playery + 120 < Py12 + this.height && jump == false)
                    ){
                        Playery= Playery;
                        velocity = 0 
                        jumpcounter = 0;
                    }
                }
        };

        //Points based on height

        let IncreasePoints;
        let DecreasePoints;
        let previousY = 1070;

        function PointsChange(){
            previousY = Points;
            if (previousY - Playery >= 100){
                Points += 2;
                IncreasePoints = true;
                setTimeout(() => {
                    IncreasePoints = false;
                }, 1000);
            }
            if (Playery - previousY <= -100){
                Points -= 2;
                DecreasePoints = true;
                setTimeout(() => {
                    DecreasePoints = false;
                }, 1000);
            }
            previousY = Playery;
        }
    
        //Enemies

        let lives = 3;
        let immunityCooldown = false;
        let redScreenOpacity = 0;
        let redScreenInterval;

        let fallingSpikes = [];
        let CanonsRight = [];
        let CanonsLeft = [];

            class Item {
                constructor() {}
                Spike() {
                    setTimeout(() => {
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
                    }, 8000);
                    for (let i = 0; i < fallingSpikes.length; i++) {
                        let imgObj = fallingSpikes[i];
                        imgObj.y += imgObj.speed;
                        image(imgObj.img, imgObj.x, imgObj.y);

                        //Collision
                        let d = dist(imgObj.x + imgObj.width/2, imgObj.y + imgObj.height/2, Playerx, Playery);
                        if (d < imgObj.width/2 + 35 && !immunityCooldown) { 

                            lives -= 1; 
                            Points -= 10;

                            immunityCooldown = true;

                            redScreenOpacity = 100;
                            redScreenInterval = setInterval(() => {
                            redScreenOpacity = redScreenOpacity == 0 ? random(10, 20) : 0;
                            }, 200);
                            
                            setTimeout(() => {

                                immunityCooldown = false;

                                clearInterval(redScreenInterval);
                                redScreenOpacity = 0;

                            }, 1000);             

                            if (lives == 0){
                                GameOver();
                            }
                        }
                    }      
                    
                    fill(255, 0, 0, redScreenOpacity);
                    rect(0, 0, width, height);
                
                };
                CanonR() {
                    setTimeout(() => {
                        if (random(1) < 0.002) {
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
                    }, 8000);
                    for (let i = 0; i < CanonsRight.length; i++) {
                        let imgObj = CanonsRight[i];
                        imgObj.x -= imgObj.speed;
                        image(imgObj.img, imgObj.x, imgObj.y);

                        let d = dist(imgObj.x + imgObj.width/2, imgObj.y + imgObj.height/2, Playerx, Playery);
                        if (d < imgObj.width/2 + 25 && !immunityCooldown) { 

                            lives -= 1;     
                            Points -= 10;

                            immunityCooldown = true;
                            
                            redScreenOpacity = 100;
                            redScreenInterval = setInterval(() => {
                            redScreenOpacity = redScreenOpacity == 0 ? random(10, 20) : 0;
                            }, 200);
                            
                            setTimeout(() => {

                                immunityCooldown = false;

                                clearInterval(redScreenInterval);
                                redScreenOpacity = 0;

                            }, 1000);

                            if (lives == 0){
                                GameOver();
                            }
                        }
                    }
                    
                    fill(255, 0, 0, redScreenOpacity);
                    rect(0, 0, width, height);
                
                };
                CanonL() {
                    setTimeout(() => {
                        if (random(1) < 0.002) {
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
                    }, 8000);
                    for (let i = 0; i < CanonsLeft.length; i++) {
                        let imgObj = CanonsLeft[i];
                        imgObj.x += imgObj.speed;
                        image(imgObj.img, imgObj.x, imgObj.y);

                        let d = dist(imgObj.x + imgObj.width/2, imgObj.y + imgObj.height/2, Playerx, Playery);
                        if (d < imgObj.width/2 + 25 && !immunityCooldown) { 

                            lives -= 1;          
                            Points -= 10;

                            immunityCooldown = true;
                            
                            redScreenOpacity = 100;
                            redScreenInterval = setInterval(() => {
                            redScreenOpacity = redScreenOpacity == 0 ? random(10, 20) : 0;
                            }, 200);
                            
                            setTimeout(() => {

                                immunityCooldown = false;

                                clearInterval(redScreenInterval);
                                redScreenOpacity = 0;

                            }, 1000);

                            if (lives == 0){
                                GameOver();
                            }
                        }
                    }
                    
                    fill(255, 0, 0, redScreenOpacity);
                    rect(0, 0, width, height);
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
        
        //Edge

        class Fin {
            constructor() {
            this.position = [600, 50];
            };
            drawEnd() {
                noStroke();
                fill(160);
                rect(this.position[0], this.position[1], 15, 150);

                noStroke();
                fill(250, 238, 12);
                circle(this.position[0] + 8, this.position[1], 25, 25);

                noStroke();
                fill(255, 0, 0);
                triangle(600, 65, 600, 100, 550, 82.5);
            };
            end() {
            if (Playery == this.position[1]) {
                Points = 100;
                GameOver();
            };
            };
        };

//Gameover

    function GameOver(){
        console.log('Game Over');
        msn = Points;
        socket.emit('Points', msn);//Ahora se envian con HTTP

        const NumPoints = document.getElementById('NumPoints');
        TotalPoints = Points * 50;
        NumPoints.innerHTML = TotalPoints;

        let dataPoint ={TotalPoints};
        sendPoints(dataPoint);

        PrizeIMG();

        screen = 5;
        switchScreen();
        // Restart();
    }

            //Send points to array
                    
            async function sendPoints(dataPoint) {//Envia puntos por HTTP
                const dataP = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(dataPoint)}
                await fetch(`/Points-Array`, dataP)
            }

    function Restart(){
        time = 0;
        Points = 0;
        Playerx = 412;
        Playery = minh;
        fallingSpikes.length = 0;
        CanonsRight.length = 0;
        CanonsLeft.length = 0;
        lives = 2;
    }

    //Disconnect

    let Sticker = './Images/Prize1.png';
    let Pin = './Images/Prize2.png';
    let KeyChain = './Images/Prize3.png';
    let KeyChainPlush = './Images/Prize4.png';
    let Figurine = './Images/Prize5.png';

    function PrizeIMG(){
        const PrizeRender = document.getElementById('PrizeDiv');

        if(TotalPoints <= 1000){        
            PrizeRender.innerHTML = `<img src=${Sticker} id="Prize" alt="Sticker">`
        }
        else if(TotalPoints >= 1000 && TotalPoints <= 2000){
            PrizeRender.innerHTML = `<img src=${Pin} id="Prize" alt="Pin">`
        }
        else if(TotalPoints >= 2000 && TotalPoints <= 3000){
            PrizeRender.innerHTML = `<img src=${KeyChain} id="Prize" alt="Keychain">`
        }
        else if(TotalPoints >= 3000 && TotalPoints <= 4000){
            PrizeRender.innerHTML = `<img src=${KeyChainPlush} id="Prize" alt="Keychain Plush">`
        }
        else if(TotalPoints >= 4000 && TotalPoints <= 5000){
            PrizeRender.innerHTML = `<img src=${Figurine} id="Prize" alt="Figurine">`
        }
    }