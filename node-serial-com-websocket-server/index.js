//Server
import { express, Server, cors, SerialPort, ReadlineParser } from './dependencies.js'

const PORT = 5050;
const SERVER_IP = '192.168.1.11'; //Change IP
const expressApp = express();
expressApp.use(cors());

    //Server
    const httpServer = expressApp.listen(PORT, () => { //Start the server
        console.log(`Server is running, host http://${SERVER_IP}:${PORT}/`);
    })

    const io = new Server(httpServer, { path: '/real-time', cors:{origin: '*', methods: ['GET', 'POST']} }); //WebSocket Server (instance) initialization

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
const port = new SerialPort(protocolConfiguration);
const parser = port.pipe(new ReadlineParser);

parser.on('data', (arduinoData) => {
    let dataArray = arduinoData.split(' ');
    console.log(dataArray);

    let arduinoMessage = {
        actionA: dataArray[0],
        actionB: dataArray[1],
        signal: parseInt(dataArray[2])
    }
    io.emit('arduinoMessage', arduinoMessage);
    // io.broadcast.emit('arduinoMessage', arduinoMessage); //broadcast
    console.log(arduinoMessage);
});

//Socket messages

io.on('connection', (socket) => {
    //Points
    socket.on('Points', (message) => {
        console.log(message);
        let Points = message * 50;
        console.log('User got ' + Points + ' points');
        socket.broadcast.emit('Final-Points', Points)
    });

    //Move instructions
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

    //Endpoint
    expressApp.get('/Forms-Array', (request, response) => {
        response.send(PlayerForm);
    });

    let PlayerForm = [];

    //Receive info
    expressApp.post('/Forms-Array', (request, response) => {  
        const {name, email, phone, notify} = request.body; 
        response.json({ received: request.body });
        PlayerForm.push(request.body)
        console.log(PlayerForm);
    });

//User points

    //Endpoint
    expressApp.get('/Points-Array', (request, response) => {
        response.send(Points_Array);
    });

    let Points_Array = [0];

    //Receive info
    expressApp.post('/Points-Array', (request, response) => { 
        const {Points} = request.body; 
        response.json({ received: request.body });
        Points_Array.push(request.body);
        console.log(Points_Array);
    });