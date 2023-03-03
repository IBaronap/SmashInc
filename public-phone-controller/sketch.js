const NGROK = `${window.location.hostname}`;
console.log('Server IP: ', NGROK);
let socket = io(NGROK, { path: '/real-time' });
let canvas;

let controllerX = 0;
let interactions = 0;
let isTouched = false;

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


socket.on('loadPage', (page) => {
    window.location.href = page;
  });