const TPLink = require('tplink-smarthome-api').Client;

let devices = {}

const tplink = new TPLink();
tplink.startDiscovery().on('plug-new', (device) => {
    device.getSysInfo().then(info => {
        registarDevice(info.alias, device);
        console.log("Discovered TP Link Plug device "+ info.alias + " at " + device.host);
    });
  }
);

const registarDevice = (alias, device) => {
    devices[alias] = device;
}

const getTPLinkDevice = (alias) => {
    return devices[alias]
}

module.exports = getTPLinkDevice;