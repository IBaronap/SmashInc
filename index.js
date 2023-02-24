import express from 'express';
import { Server } from 'socket.io';

const expressApp = express(); //Environment setup
const PORT = 5050;

//Mupi
expressApp.use(express.json()) //Middlewares
expressApp.use('/mupi-home', express.static('public-home')); //Middlewares
expressApp.use('/mupi-connected', express.static('public-connected')); 
expressApp.use('/mupi-gameover', express.static('public-gameover')); 
expressApp.use('/mupi-disconnect', express.static('public-disconnect')); 
//Phone
expressApp.use('/phone-connected', express.static('public-phone-connected'));
expressApp.use('/phone-controller', express.static('public-phone-controller'));
expressApp.use('/phone-gameover', express.static('public-phone-gameover'));
expressApp.use('/phone-form', express.static('public-phone-form'));
expressApp.use('/phone-disconnect', express.static('public-phone-disconnect'));

// expressApp.listen(PORT);
const httpServer = expressApp.listen(PORT, () => { //Star the server
    console.log(`http://localhost:${PORT}/app`);
})

const io = new Server(httpServer, { path: '/real-time' }); //WebSocket Server (instance) initialization

io.on('connection', (socket) => { //Listening for webSocket connections
    
});