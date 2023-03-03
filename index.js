import express from 'express';
import { Server } from 'socket.io';
const PORT = 5050;
const SERVER_IP = '172.30.95.100';
const expressApp = express(); //Environment setup

//Mupi
expressApp.use(express.json()) //Middlewares
expressApp.use('/mupi-home', express.static('public-home')); //Middlewares
expressApp.use('/mupi-connected', express.static('public-connected')); 
expressApp.use('/mupi-game', express.static('public-game')); 
expressApp.use('/mupi-gameover', express.static('public-gameover')); 
expressApp.use('/mupi-disconnect', express.static('public-disconnect')); 
//Phone
expressApp.use('/phone-connected', express.static('public-phone-connected'));
expressApp.use('/phone-controller', express.static('public-phone-controller'));
expressApp.use('/phone-gameover', express.static('public-phone-gameover'));
expressApp.use('/phone-form', express.static('public-phone-form'));
expressApp.use('/phone-disconnect', express.static('public-phone-disconnect'));

// expressApp.listen(PORT);
const httpServer = expressApp.listen(PORT, () => { //Start the server
    console.log(`Server is running, host http://${SERVER_IP}:${PORT}/`);
    console.table({
        'Mupi Endpoint Home' : `http://${SERVER_IP}:${PORT}/mupi-home`,
        'Mupi Endpoint Connected' : `http://${SERVER_IP}:${PORT}/mupi-connected`,
        'Mupi Endpoint Game over' : `http://${SERVER_IP}:${PORT}/mupi-gameover`,
        'Mupi Endpoint Disconnect' : `http://${SERVER_IP}:${PORT}/mupi-disconnect`,
        'Client Endpoint Connected' : `http://${SERVER_IP}:${PORT}/phone-connected`,
        'Client Endpoint Controller' : `http://${SERVER_IP}:${PORT}/phone-controller`,
        'Client Endpoint Game over' : `http://${SERVER_IP}:${PORT}/phone-gameover`,
        'Client Endpoint Form' : `http://${SERVER_IP}:${PORT}/phone-form`,
        'Client Endpoint Disconnect' : `http://${SERVER_IP}:${PORT}/phone-disconnect`,
    })
})

const io = new Server(httpServer, { path: '/real-time' }); //WebSocket Server (instance) initialization

io.on('connection', (socket) => { //Listening for webSocket connections
    socket.on('Points', (message) => {
        console.log(message);
        let Points = message * 50;
        console.log(Points);
        socket.broadcast.emit('Final-Points', Points)
    });

    socket.on('Instructions', (message) => {
        console.log(message);
        socket.broadcast.emit('Move-Player', message)
    });
});

expressApp.get('/Forms-Array', (request, response) => {
    response.send(PlayerForm);
});

let PlayerForm = [];

expressApp.post('/Forms-Array', (request, response) => {  
    const {name, email, phone, notify} = request.body; 
    response.json({ received: request.body });
    PlayerForm.push(request.body)
    console.log(PlayerForm);
});