// General
const NGROK = `${window.location.hostname}`;
console.log('Server IP: ', NGROK);
let socket = io(NGROK, {path: '/real-time'})
let canvas;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

//Switch Screens
let screen = 1;
let switchMSN;

//From QR to Waiting (Mupi)

window.addEventListener("load", function (event) {
    console.log("Page loaded");
    interactionTimer();
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
    switch (screen) {
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
    }
};

//Form

//Lets the button be abled to use by checking if the "Terms and conditions" is cheked
let button = document.getElementById('ButtonSendForm');

let Disable = document.getElementById('CheckT&C');

Disable.addEventListener('change', function () {
    if (this.checked) {
        button.removeAttribute('disabled');
    } else {
        button.setAttribute('disabled', true);
    }
});

//The user data

let user = {
    name: "",
    email: "",
    phone: "",
    privacyAgreement: "",
    nintendoUser: "",
    interactionTime: "",
    notify: "",
    lead: true,
    date: "",
    timeStamp: ""
};

//Tiempo de interacción (tiempo de mupi + tiempo de forms)
    //Tiempo de mupi
    let loadedInteractionTime;

    async function getTimeData() {
        const response = await fetch('/Time'); //Fetch al array que guarda los puntos
        data = await response.json();
        const lastElement = data[data.length - 1]; 

        if (typeof lastElement === 'object' && 'interactionTime' in lastElement) {//Busca el ultimo elemento del array
            const lastValue = lastElement.interactionTime;
            console.log("El último valor del array es:", lastValue);
            loadedInteractionTime = lastValue;
        } else {
            console.log("No se pudo encontrar la propiedad 'interactionTime' en el último elemento.");
        }
    }

    getTimeData();

    //Tiempo en forms
    let interactionTime = 0;
    let intervalId = null;

    function interactionTimer() {
        intervalId = setInterval(() => {
        interactionTime++;
        console.log(interactionTime);
        }, 1000); // 1000 ms = 1 segundo
    }

//Al undir el boton se registran los datos
button.addEventListener("click", function () {

    //User
        user.name = document.getElementById("nameBox").value;
        user.email = document.getElementById("emailBox").value;
        user.phone = document.getElementById("numberBox").value;
        user.privacyAgreement = Disable.checked;
        user.nintendoUser = document.getElementById("Check3").checked;
        user.interactionTime = loadedInteractionTime + interactionTime;
        user.notify = document.getElementById("Check2").checked;

    //Interaction

        let now = new Date();
    
        //Get day
        let options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        let dateWithoutCommas = now.toLocaleDateString('es-ES', options).replace(/,/g, '');
        user.date = dateWithoutCommas;

        //Get time

        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        user.timeStamp = `${hours}:${minutes}`;

    console.log(user);
    sendData(user);
});

async function sendData(data) {//se envia a index
    const dataF = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    };
    await fetch(`/user`, dataF);
}

//Disconnect

let Sticker = './Images/Prize1.png';
let Pin = './Images/Prize2.png';
let KeyChain = './Images/Prize3.png';
let KeyChainPlush = './Images/Prize4.png';
let Figurine = './Images/Prize5.png';

const PrizeRender = document.getElementById('PrizeDiv');

//Fetch points from array

async function getData() {
    const response = await fetch('/Points-Array'); //Fetch al array que guarda los puntos
    data = await response.json();
    const lastElement = data[data.length - 1]; 

    if (typeof lastElement === 'object' && 'TotalPoints' in lastElement) {//Busca el ultimo elemento del array
        const lastValue = lastElement.TotalPoints;
        console.log("El último valor del array es:", lastValue);
        PrizeIMG(lastValue);
    } else {
        console.log("No se pudo encontrar la propiedad 'TotalPoints' en el último elemento.");
    }
}

getData();

//Render prize 

function PrizeIMG(RenderPoints) {
    const PrizeRender = document.getElementById('PrizeDiv');

    if (RenderPoints <= 1000) {
        PrizeRender.innerHTML = `<img src=${Sticker} id="Prize" alt="Sticker">`
    } else if (RenderPoints >= 1000 && RenderPoints <= 2000) {
        PrizeRender.innerHTML = `<img src=${Pin} id="Prize" alt="Pin">`
    } else if (RenderPoints >= 2000 && RenderPoints <= 3000) {
        PrizeRender.innerHTML = `<img src=${KeyChain} id="Prize" alt="Keychain">`
    } else if (RenderPoints >= 3000 && RenderPoints <= 4000) {
        PrizeRender.innerHTML = `<img src=${KeyChainPlush} id="Prize" alt="Keychain Plush">`
    } else if (RenderPoints >= 4000 && RenderPoints <= 5000) {
        PrizeRender.innerHTML = `<img src=${Figurine} id="Prize" alt="Figurine">`
    }
}