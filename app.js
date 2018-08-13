const dotenv = require('dotenv');
var WebSocketClient = require('websocket').client;
const exec = require('child_process').exec;
const sendSignal = require('./lib/sendSignal');
const signals = require('./config/signals');

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
            let messageJson = JSON.parse(message);
            console.log("Received: '" + message.utf8Data + "'");

            //TODO errot handring
            sendSignal(signals[messageJson.command]);
            // exec('python /Users/Koji/dev/smart_home/BlackBeanControl/BlackBeanControl.py -c light-on', (err, stdout, stderr) => {
            //     if (err) { console.log(err); }
            //     console.log(stdout);
            // });
        }
    });
});

const connect = () => {
    client.connect(host, 'khp', process.env.ORIGIN);
}

const setRecconectTimer = () => {
    setTimeout(() => {
        connect();
    }, recconectInterval);
}

connect();
