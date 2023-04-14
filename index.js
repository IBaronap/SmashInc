//Server
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
const PORT = 5050;
const SERVER_IP = '192.168.1.6'; //Change IP
const expressApp = express();
expressApp.use(cors());

//To let communication between localhost and ngrok
expressApp.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

expressApp.use(cors({
    origin: '*'
}));

//Endpoints

//Mupi
expressApp.use(express.json()) 
expressApp.use('/mupi', express.static('public-home')); 
//Phone
expressApp.use('/phone', express.static('public-phone-connected'));

//Server
const httpServer = expressApp.listen(PORT, () => { //Start the server
    console.log(`Server is running, host http://${SERVER_IP}:${PORT}/`);
})

const io = new Server(httpServer, { path: '/real-time', cors:{origin: '*', methods: ['GET', 'POST']} }); //WebSocket Server (instance) initialization

//Socket messages
io.on('connection', (socket) => {
    socket.on('Points', (message) => {
        console.log(message);
        let Points = message * 50;
        console.log('User got ' + Points + ' points');
        socket.broadcast.emit('Final-Points', Points)
    });

    socket.on('Instructions', (message) => {
        console.log(message);
        socket.broadcast.emit('Move-Player', message)
    });

    socket.on('switchPage', (message) => {
        console.log('Switch to screen '+ message);
        socket.broadcast.emit('switch', message)
    });
});

//User info from form
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