'use strict';

let broadlink = require('./getBloadlinkDevice');

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
