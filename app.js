const dotenv = require('dotenv');
var WebSocketClient = require('websocket').client;
const exec = require('child_process').exec;
const signals = require('./config/signals');
const sendData = require('./lib/sendData');

dotenv.config();
var client = new WebSocketClient();
const host = process.env.WS_HOST;
const recconectInterval = parseInt(process.env.RECONNECT_INTERVAL);

client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
    setRecconectTimer();
});

client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');

    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        console.log('Connection Closed');
        setRecconectTimer();
    });
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
            let messageJson = JSON.parse(message.utf8Data);
            //TODO error handling
            messageJson.commands.forEach(command => {
                sendData(signals[command]);

            });
        }
    });
});

const connect = () => {
    client.connect(host, 'hcp', process.env.ACCESS_TOKEN); //hcp=home control protocol
}

const setRecconectTimer = () => {
    setTimeout(() => {
        connect();
    }, recconectInterval);
}

connect();
