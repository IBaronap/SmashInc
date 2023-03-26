// General
const NGROK = `${window.location.hostname}`;
console.log('Server IP: ', NGROK);
let socket = io("http://localhost:5050", { path: '/real-time' })
let canvas;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

//Switch Screens
let screen = 1;
let switchMSN;

    //From Connected to Game (Mupi) and Controller (Phone)
        document.getElementById('ConnectedBTN').addEventListener('click', () => {
            //Mupi
            switchMSN = 3;
            socket.emit('switchPage', switchMSN);

            //Phone
            screen = 2;
            switchScreen();
        });

    //From Controller to GameOver
        socket.on('switch', (msn) => {
            screen = msn;
            switchScreen();
        });

    //From Gameover to Form
        document.getElementById('GameoverBTN').addEventListener('click', () => {
            screen = 4;
            switchScreen();
        });

    //From Form to Disconnect (both Mupi and Phone)
    document.getElementById('ButtonSendForm').addEventListener('click', () => {
        //Mupi
        switchMSN = 5;
        socket.emit('switchPage', switchMSN);

        //Phone
        screen = 5;
        switchScreen();
    });

    //From Disconnect to Home (Mupi)
    document.getElementById('DisconnectBTN').addEventListener('click', () => {
        //Msn para que Mupi vuelva a Home
        switchMSN = 1;
        switchScreen();
        socket.emit('switchPage', switchMSN);
    });

//Switch screen

function switchScreen() {
    switch(screen) {
        case 1:
            document.getElementById('Connected').style.display = 'block';
            document.getElementById('Controller').style.display = 'none';
            document.getElementById('Gameover').style.display = 'none';
            document.getElementById('Form').style.display = 'none';
            document.getElementById('Disconnect').style.display = 'none';
            break;
        case 2:
            document.getElementById('Connected').style.display = 'none';
            document.getElementById('Controller').style.display = 'block';
            document.getElementById('Gameover').style.display = 'none';
            document.getElementById('Form').style.display = 'none';
            document.getElementById('Disconnect').style.display = 'none';
            break;
        case 3:
            document.getElementById('Connected').style.display = 'none';
            document.getElementById('Controller').style.display = 'none';
            document.getElementById('Gameover').style.display = 'block';
            document.getElementById('Form').style.display = 'none';
            document.getElementById('Disconnect').style.display = 'none';
            break;
        case 4:
            document.getElementById('Connected').style.display = 'none';
            document.getElementById('Controller').style.display = 'none';
            document.getElementById('Gameover').style.display = 'none';
            document.getElementById('Form').style.display = 'block';
            document.getElementById('Disconnect').style.display = 'none';
            break;
        case 5:
            document.getElementById('Connected').style.display = 'none';
            document.getElementById('Controller').style.display = 'none';
            document.getElementById('Gameover').style.display = 'none';
            document.getElementById('Form').style.display = 'none';
            document.getElementById('Disconnect').style.display = 'block';
            break;
        default:
            console.log('Screen does not exist');
      }};

//Connected

//Controller

    let controllerX = 0;
    let interactions = 0;
    let isTouched = false;

    function setup() {
        canvas = createCanvas(windowWidth, windowHeight);
        canvas.style('z-index', '2');
        canvas.style('position', 'fixed');
        canvas.style('top', '0');
        canvas.style('right', '0');
        canvas.parent("Controller");
        background(255);
        frameRate(16);
        controllerX = windowWidth / 2;
        controllerY = windowHeight / 2;
    }

    document.querySelector('#JumpButton').addEventListener('click', () => {
        touch('UP');
    });

    document.querySelector('#LeftButton').addEventListener('click', () => {
        touch('LEFT');
    });

    document.querySelector('#RightButton').addEventListener('click', () => {
        touch('RIGHT');
    });

    function touch(instruction) {
        let msn = '';

        switch (instruction) {
            case 'UP':
                msn = 'UP';
                console.log('up');            
                break;
            
            case 'LEFT':
                msn = 'LEFT';
                console.log('left');
                break;

            case 'RIGHT':
                msn = 'RIGHT';
                console.log('right');
                break;
        }

        if (msn !== '') {
            socket.emit('Instructions', msn)
        }
        
    }

//Gameover

    let Points;
    const NumPoints = document.getElementById('NumPoints');

        socket.on('Final-Points', msn => {
            console.log(msn);
            Points = msn;
            NumPoints.innerHTML = Points;
            }
        )

//Form

    //Lets the button be abled to use by checking if the "Terms and conditions" is cheked
    let button = document.getElementById('ButtonSendForm');

        let Disable = document.getElementById('CheckT&C');

        Disable.addEventListener('change', function() {
            if (this.checked) {
                button.removeAttribute('disabled');
            } else {
                button.setAttribute('disabled', true);
            }
        });

    //The user data

    let data = {
        name: "",
        email: "",
        phone: "",
        notify: ""
    };

    button.addEventListener('click', function(){
        data.name = document.getElementById("nameBox").value;
        data.email = document.getElementById("emailBox").value;
        data.phone = document.getElementById("numberBox").value;
        data.notify = document.getElementById("Check2").checked;

        console.log(data);
        send(data);
    });

    async function send(data) {
        const datas = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)}
        await fetch(`/Forms-Array`, datas)
    }

//Disconnect

    let Sticker = './Images/Prize1.png';
    let Pin = './Images/Prize2.png';
    let KeyChain = './Images/Prize3.png';
    let KeyChainPlush = './Images/Prize4.png';
    let Figurine = './Images/Prize5.png';

    const PrizeRender = document.getElementById('PrizeDiv');

        socket.on('Final-Points', msn => {
            console.log(msn);
            Points = msn;
                if(Points <= 600){        
                    PrizeRender.innerHTML = `<img src=${Sticker} id="Prize" alt="Sticker"><p id="PrizeDesc">Sticker</p>`
                }
                else if(Points >= 600 && Points <= 1200){
                    PrizeRender.innerHTML = `<img src=${Pin} id="Prize" alt="Pin"> <p id="PrizeDesc">Pin</p>`
                }
                else if(Points >= 1200 && Points <= 1800){
                    PrizeRender.innerHTML = `<img src=${KeyChain} id="Prize" alt="Keychain"> <p id="PrizeDesc">Keychain</p>`
                }
                else if(Points >= 1800 && Points <= 2400){
                    PrizeRender.innerHTML = `<img src=${KeyChainPlush} id="Prize" alt="Keychain Plush"> <p id="PrizeDesc">Keychain Plush</p>`
                }
                else if(Points >= 2400 && Points <= 3000){
                    PrizeRender.innerHTML = `<img src=${Figurine} id="Prize" alt="Figurine"> <p id="PrizeDesc">Figurine</p>`
                }
            }
        )