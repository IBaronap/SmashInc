let socket = io("http://localhost:5050", { path: '/real-time' })
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

let Sticker = './Images/Prize1.png';
let Pin = './Images/Prize2.png';
let KeyChain = './Images/Prize3.png';
let KeyChainPlush = './Images/Prize4.png';
let Figurine = './Images/Prize5.png';

const PrizeRender = document.getElementById('PrizeDiv');

let Points;

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

socket.on('switch', (msn) => {
    window.location.href = msn;
 });