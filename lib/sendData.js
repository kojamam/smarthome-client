'use strict';

let broadlink = require('./getDevice');
let dotenv = require('dotenv');

dotenv.config();
let rm = false;
const rmMac = process.env.RM_MAC;

const sendData = (payload) => {
    const timer = setInterval(function () {
        rm = broadlink({ host: rmMac });
        if (rm) {
            const hexDataBuffer = new Buffer(payload, 'hex');
            rm.sendData(hexDataBuffer);
            clearInterval(timer);
        };
        return;
    }, 100);
}

module.exports = sendData;
