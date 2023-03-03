import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
const PORT = 5050;
const SERVER_IP = '192.168.1.54';
const expressApp = express(); //Environment setup
expressApp.use(cors());

//Mupi
expressApp.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

expressApp.use(cors({
    origin: '*'
}));

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
})

const io = new Server(httpServer, { path: '/real-time', cors:{origin: '*', methods: ['GET', 'POST']} }); //WebSocket Server (instance) initialization

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

    socket.on('switchPage', (message) => {
        console.log(message);
        socket.broadcast.emit('switch', message)
    });

    socket.on('switchPage', (message) => {
        console.log(message);
        socket.broadcast.emit('switch', message)
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