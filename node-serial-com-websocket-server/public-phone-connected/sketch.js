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

    //From QR to Waiting (Mupi)

    window.addEventListener("load", function(event) {
        console.log("Page loaded");
        switchMSN = 7;
        socket.emit('switchPage', switchMSN);
      });

    //From Form to Disconnect (both Mupi and Phone)
    document.getElementById('ButtonSendForm').addEventListener('click', () => {
        //Mupi
        switchMSN = 8;
        socket.emit('switchPage', switchMSN);

        //Phone
        screen = 2;
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
            document.getElementById('Form').style.display = 'block';
            document.getElementById('Disconnect').style.display = 'none';
            break;
        case 2:
            document.getElementById('Form').style.display = 'none';
            document.getElementById('Disconnect').style.display = 'block';
            break;
        default:
            console.log('Screen does not exist');
      }};

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

    //Fetch points from array

    async function getData(){
        const response = await fetch('/Points-Array');
        data = await response.json();
        RenderPoints = data[data.length - 1];
        console.log(data);
        console.log(RenderPoints);
        PrizeIMG(RenderPoints);
    }

    getData();

    //Render prize 
    
    function PrizeIMG(RenderPoints){
        const PrizeRender = document.getElementById('PrizeDiv');

        if(RenderPoints <= 600){        
            PrizeRender.innerHTML = `<img src=${Sticker} id="Prize" alt="Sticker">`
        }
        else if(RenderPoints >= 600 && RenderPoints <= 1200){
            PrizeRender.innerHTML = `<img src=${Pin} id="Prize" alt="Pin">`
        }
        else if(RenderPoints >= 1200 && RenderPoints <= 1800){
            PrizeRender.innerHTML = `<img src=${KeyChain} id="Prize" alt="Keychain">`
        }
        else if(RenderPoints >= 1800 && RenderPoints <= 2400){
            PrizeRender.innerHTML = `<img src=${KeyChainPlush} id="Prize" alt="Keychain Plush">`
        }
        else if(RenderPoints >= 2400 && RenderPoints <= 3000){
            PrizeRender.innerHTML = `<img src=${Figurine} id="Prize" alt="Figurine">`
        }
    }