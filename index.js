import express from 'express';
import { Server } from 'socket.io';

const expressApp = express(); //Environment setup
const PORT = 5050;

expressApp.use(express.json()) //Middlewares
expressApp.use('/mupi-home', express.static('public-home')); //Middlewares
expressApp.use('/mupi-connected', express.static('public-connected')); 
expressApp.use('/mupi-gameover', express.static('public-gameover')); 
expressApp.use('/mupi-disconnect', express.static('public-disconnect')); 

// expressApp.listen(PORT);
const httpServer = expressApp.listen(PORT, () => { //Star the server
    console.log(`http://localhost:${PORT}/app`);
})

const io = new Server(httpServer, { path: '/real-time' }); //WebSocket Server (instance) initialization

io.on('connection', (socket) => { //Listening for webSocket connections
    
});