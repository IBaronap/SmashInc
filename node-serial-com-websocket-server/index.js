//Server
import { express, SocketIOServer, cors, SerialPort, ReadlineParser, dotenv, fs } from './dependencies.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import fireStoreDB from './firebase-config.js';

dotenv.config();
const PORT = process.env.PORT;
const SERVER_IP = ' 172.30.179.100'; //Change IP
const expressApp = express();
expressApp.use(cors());

//Lee datos de firebase
fireStoreDB.getCollection('Leads').then((leads) => {
    console.log(leads);
  })

fireStoreDB.getCollection('Interactions').then((interactions) => {
    console.log(interactions);
})


    //Server
    const httpServer = expressApp.listen(PORT, () => { //Start the server
        console.log(`Server is running, host http://${SERVER_IP}:${PORT}/`);
    })

    const io = new SocketIOServer(httpServer, { path: '/real-time', cors:{origin: '*', methods: ['GET', 'POST']} }); //WebSocket Server initialization

//Permite comunicación entre localhost y ngrok
expressApp.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

expressApp.use(cors({origin: '*'}));

//Endpoints

    //Mupi
    expressApp.use(express.json()) 
    expressApp.use('/mupi', express.static('public-home')); 
    //Phone
    expressApp.use('/phone', express.static('public-phone-connected'));
    //Dashboard
    const STATIC_DASHBOARD = express.static('./static/dashboard-app');
    expressApp.use('/dashboard-app', STATIC_DASHBOARD);
    expressApp.use('/user', userRoutes);
    expressApp.use('/dashboard', dashboardRoutes);

//Arduino 

const protocolConfiguration = { 
    path: 'COM8', //COM#
    baudRate: 9600
};
const port = new SerialPort(protocolConfiguration); //Comunicación con el arduino
const parser = port.pipe(new ReadlineParser); //Analiza la información recibida de arduino

parser.on('data', (arduinoData) => { //Recibe datos del arduino
    let dataArray = arduinoData.split(' '); //Divide el mensaje de arduino
    console.log(dataArray);

    let arduinoMessage = {
        actionA: dataArray[0], //J para Joystick, B para botón
        actionB: dataArray[1], //X para joystick, A para botón
        signal: parseInt(dataArray[2]) //Señal solo cambia si es de joystick
    }
    io.emit('arduinoMessage', arduinoMessage); //Emite los mensajes de arduino
    console.log(arduinoMessage);
});

//Socket messages

io.on('connection', (socket) => {
    //Points (Se usaba para enviar los puntos, pero ahora esta con HTTP)
    socket.on('Points', (message) => {
        console.log(message);
        let Points = message * 50;
        console.log('User got ' + Points + ' points');
        socket.broadcast.emit('Final-Points', Points)
    });

    //Move instructions (Se usaba para mvoer el personaje cuando el celular era el control)
    socket.on('Instructions', (message) => {
        console.log(message);
        socket.broadcast.emit('Move-Player', message)
    });

    //Cambio de pantalla entre celular y mupi
    socket.on('switchPage', (message) => {
        console.log('Switch to screen '+ message);
        socket.broadcast.emit('switch', message)
    });

    //Orden para Arduino (musica)
    socket.on('orderForArduino', (orderForArduino) => {
        port.write(orderForArduino);
        console.log('orderForArduino: ' + orderForArduino);
    });
});

//Hace update de firebase
fireStoreDB.updateRealTime('Leads', () => {
    io.emit('real-time-update', { state: 'Using onSnapshot' })
  });

//HTTP

    //Info de usario
        // Endpoint 
        expressApp.get('/Forms-Array', (request, response) => {
            response.send(PlayerForm);
        });

        let PlayerForm = [];

        // Recibir información del formulario de jugadores
        expressApp.post('/Forms-Array', (request, response) => {
            console.log("Form data received:" + request.body);
            const { name, email, phone, notify } = request.body;
            PlayerForm.push({ name, email, phone, notify });
            console.log("PlayerForm:", PlayerForm);
            response.json({ received: request.body });
        });

    // Puntos de usuario
        // Endpoint
        expressApp.get('/Points-Array', (request, response) => {
            response.send(Points_Array);
        });

        let Points_Array = [];

        // Recibir información de los puntos
        expressApp.post('/Points-Array', (request, response) => {
            const { TotalPoints } = request.body;
            Points_Array.push({ TotalPoints });
            console.log("Points data received:", request.body);
            console.log("Points_Array:", Points_Array);
            response.json({ received: request.body });
        });

    // Tiempo de interacción
        // Endpoint para el tiempo
        expressApp.get('/Time', (request, response) => {
            response.send(InteractionTime);
        });

        let InteractionTime = [];

        // Recibir información del tiempo
        expressApp.post('/Time', (request, response) => {
            const interactionTime = request.body;
            InteractionTime.push(interactionTime);
            console.log("duration of last interaction:", request.body);
            console.log("InteractionTime:", InteractionTime);
            response.json({ received: request.body });
        });

export { io };