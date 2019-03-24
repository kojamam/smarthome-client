'use strict';

let broadlink = require('./getDevice');
let dotenv = require('dotenv');

dotenv.config();
let device = false;

const sendData = (payload) => {
    const timer = setInterval(function () {
        device = broadlink({});
        if (device) {
            const hexDataBuffer = new Buffer.from(payload, 'hex');
            device.sendData(hexDataBuffer);
            clearInterval(timer);
        };
        return;
    }, 100);
}

module.exports = sendData;
