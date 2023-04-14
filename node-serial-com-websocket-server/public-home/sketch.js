// General
const NGROK = `${window.location.hostname}`;
console.log('Server IP: ', NGROK);

let socket = io("http://localhost:5050", { path: '/real-time' })
let canvas;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

//Arduino msn

socket.on('arduinoMessage', (arduinoMessage) => {
    console.log(arduinoMessage);
    let { actionA, actionB, signal } = arduinoMessage;
    ArduinoBTNClicked(actionB);
    BTNSounds(actionA);
    moveJump([actionA, signal]);
    moveX([actionB, signal]);
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

    document.getElementById('QR').addEventListener('click', () => { /*Cambiar id del QR para que cambie de screen */
        screen = 2;
        switchScreen();
    });

    socket.on('switch', (msn) => {
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
                    socket.emit('orderForArduino','G');
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
                    socket.emit('orderForArduino','O');
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
            gravity ();
            game ();
            points();
    
            stroke(255);
            fill(255);
            textSize(50);
            text(Points, 760, 75);
        }
    }

    function windowResized() {
        resizeCanvas(850, 1253);
    }
   
    //Juego SetUp

    function game (){
        image (back, -5, 0, width+5, height);
        image (stuff, 20, minh, 0, 0);

        var player = playerR;
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
    let playerJ;

    let stand;
    let canon;
    let canonL;
    let spikes;
    let stuff;
    let floor;
    let back;
    
    function preload (){
        playerR = loadImage('./Images/MarioR.png');
        playerL = loadImage('./Images/MarioL.png');
        playerJ = loadImage('./Images/MarioJ.png');

        stand = loadImage ('./Images/Platform.png');
        canon = loadImage ('./Images/Canon.png');
        canonL = loadImage ('./Images/Canon2.png');
        spikes = loadImage ('./Images/Spikes.png');
        stuff = loadImage('./Images/Stuff.png');
        floor = loadImage('./Images/Floor.png');
        back = loadImage('./Images/Background.png');
    }

    //BTN Sounds

    function BTNSounds(actionA){
        if (actionA == 'B') {
            if (screen == 4){
                socket.emit('orderForArduino','J');
            }
            else if (screen == 1 || screen == 2 || screen == 3 || screen == 5){
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

            //Movement

            function moveX([direction, signal]) {
                if(direction[0] == 'X'){

                    switch(signal){
                        case 0:
                            if (Playerx >= minw) {
                                Playerx -= 20;
                                socket.emit('orderForArduino','W');
                                };
                            break;
            
                        case 2:
                            if (Playerx <= maxw) {
                                Playerx += 20;
                                socket.emit('orderForArduino','W');
                                };
                            break;
            
                        case 1:
                            Playerx = Playerx;
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

        //Class Platforms & collision cases

        var Px1 = 500;  var Py1 = 1100;
        var Px2 = 325;  var Py2 = 950;
        var Px3 = 475;  var Py3 = 825;
        var Px4 = 300;  var Py4 = 675;
        var Px5 = 150;  var Py5 = 550;
        var Px6 = 400;  var Py6 = 475;
        var Px7 = 200;  var Py7 = 350;
        var Px8 = 600;  var Py8 = 300;
        var Px9 = 300;  var Py9 = 200;
        var Px10 = 600; var Py10 = 100;
        var Px11 = 100; var Py11 = 100;

        class Platforms {
        constructor(){
            this.width = 140;
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
              };

              collision(){
                if (   (Playerx >= Px1 - this.width/2 + 20 && Playerx <= Px1 + this.width/2 + 20 && Playery + 120 >= Py1 - this.height/2 && Playery + 120 < Py1 + this.height && jump == false)
                    || (Playerx >= Px2 - this.width/2 + 20 && Playerx <= Px2 + this.width/2 + 20 && Playery + 120 >= Py2 - this.height/2 && Playery + 120 < Py2 + this.height && jump == false)
                    || (Playerx >= Px3 - this.width/2 + 20 && Playerx <= Px3 + this.width/2 + 20 && Playery + 120 >= Py3 - this.height/2 && Playery + 120 < Py3 + this.height && jump == false)
                    || (Playerx >= Px4 - this.width/2 + 20 && Playerx <= Px4 + this.width/2 + 20 && Playery + 120 >= Py4 - this.height/2 && Playery + 120 < Py4 + this.height && jump == false)
                    || (Playerx >= Px5 - this.width/2 + 20 && Playerx <= Px5 + this.width/2 + 20 && Playery + 120 >= Py5 - this.height/2 && Playery + 120 < Py5 + this.height && jump == false)
                    || (Playerx >= Px6 - this.width/2 + 20 && Playerx <= Px6 + this.width/2 + 20 && Playery + 120 >= Py6 - this.height/2 && Playery + 120 < Py6 + this.height && jump == false)
                    || (Playerx >= Px7 - this.width/2 + 20 && Playerx <= Px7 + this.width/2 + 20 && Playery + 120 >= Py7 - this.height/2 && Playery + 120 < Py7 + this.height && jump == false)
                    || (Playerx >= Px8 - this.width/2 + 20 && Playerx <= Px8 + this.width/2 + 20 && Playery + 120 >= Py8 - this.height/2 && Playery + 120 < Py8 + this.height && jump == false)
                    || (Playerx >= Px9 - this.width/2 + 20 && Playerx <= Px9 + this.width/2 + 20 && Playery + 120 >= Py9 - this.height/2 && Playery + 120 < Py9 + this.height && jump == false)
                    || (Playerx >= Px10 - this.width/2 + 20 && Playerx <= Px10 + this.width/2 + 20 && Playery + 120 >= Py10 - this.height/2 && Playery + 120 < Py10 + this.height && jump == false)
                    || (Playerx >= Px11 - this.width/2 + 20 && Playerx <= Px11 + this.width/2 + 20 && Playery + 120 >= Py11 - this.height/2 && Playery + 120 < Py11 + this.height && jump == false)
                   ){
                        Playery= Playery;
                        velocity = 0 
                        jumpcounter = 0;
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
                        if (d < imgObj.width/2 + 40) { 
                            GameOver();
                        }}      
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
                        if (d < imgObj.width/2 + 25) { 
                            GameOver();
                        }
                    }
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
        
        //Edge

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

//Gameover

    function GameOver(){
        console.log('Game Over');
        msn = Points;
        socket.emit('Points', msn);

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
                    
            async function sendPoints(dataPoint) {
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
    }

    //Disconnect

    let Sticker = './Images/Prize1.png';
    let Pin = './Images/Prize2.png';
    let KeyChain = './Images/Prize3.png';
    let KeyChainPlush = './Images/Prize4.png';
    let Figurine = './Images/Prize5.png';

    function PrizeIMG(){
        const PrizeRender = document.getElementById('PrizeDiv');

        if(TotalPoints <= 600){        
            PrizeRender.innerHTML = `<img src=${Sticker} id="Prize" alt="Sticker">`
        }
        else if(TotalPoints >= 600 && TotalPoints <= 1200){
            PrizeRender.innerHTML = `<img src=${Pin} id="Prize" alt="Pin">`
        }
        else if(TotalPoints >= 1200 && TotalPoints <= 1800){
            PrizeRender.innerHTML = `<img src=${KeyChain} id="Prize" alt="Keychain">`
        }
        else if(TotalPoints >= 1800 && TotalPoints <= 2400){
            PrizeRender.innerHTML = `<img src=${KeyChainPlush} id="Prize" alt="Keychain Plush">`
        }
        else if(TotalPoints >= 2400 && TotalPoints <= 3000){
            PrizeRender.innerHTML = `<img src=${Figurine} id="Prize" alt="Figurine">`
        }
    }