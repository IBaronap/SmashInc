//Server
import { express, Server, cors, SerialPort, ReadlineParser } from './dependencies.js'

const PORT = 5050;
const SERVER_IP = ' 172.30.179.100'; //Change IP
const expressApp = express();
expressApp.use(cors());

    //Server
    const httpServer = expressApp.listen(PORT, () => { //Start the server
        console.log(`Server is running, host http://${SERVER_IP}:${PORT}/`);
    })

    const io = new Server(httpServer, { path: '/real-time', cors:{origin: '*', methods: ['GET', 'POST']} }); //WebSocket Server initialization

//To let communication between localhost and ngrok
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

//Arduino communication

const protocolConfiguration = { // Defining Serial configurations
    path: 'COM8', //COM#
    baudRate: 9600
};
const port = new SerialPort(protocolConfiguration); //Comunicación con el arduino
const parser = port.pipe(new ReadlineParser); //Analiza la información recibida de arduino

parser.on('data', (arduinoData) => {
    let dataArray = arduinoData.split(' ');
    console.log(dataArray);

    let arduinoMessage = {
        actionA: dataArray[0],
        actionB: dataArray[1],
        signal: parseInt(dataArray[2])
    }
    io.emit('arduinoMessage', arduinoMessage);
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

    //Page switch
    socket.on('switchPage', (message) => {
        console.log('Switch to screen '+ message);
        socket.broadcast.emit('switch', message)
    });

    //Order for arduino (music)
    socket.on('orderForArduino', (orderForArduino) => {
        port.write(orderForArduino);
        console.log('orderForArduino: ' + orderForArduino);
    });
});

//User info from form

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

// Endpoint para los puntos
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