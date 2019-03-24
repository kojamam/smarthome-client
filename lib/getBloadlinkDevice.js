const ping = require('ping');
const BroadlinkJS = require('broadlinkjs-rm');
const broadlink = new BroadlinkJS()

const pingFrequency = 5000;

let device;

const startPing = () => {
  device.state = 'unknown';

  setInterval(() => {
    ping.sys.probe(device.host.address, (active) => {
      if (!active && device.state === 'active') {
        console.log(`Broadlink RM device at ${device.host.address} (${device.host.macAddress || ''}) is no longer reachable.`);

        device.state = 'inactive';
      } else if (active && device.state !== 'active') {
        if (device.state === 'inactive') console.log(`Broadlink RM device at ${device.host.address} (${device.host.macAddress || ''}) has been re-discovered.`);

        device.state = 'active';
      }
    })
  }, pingFrequency);
}

broadlink.on('deviceReady', (d) => {
  const macAddressParts = d.mac.toString('hex').match(/[\s\S]{1,2}/g) || []
  const macAddress = macAddressParts.join(':')
  d.host.macAddress = macAddress

  console.log(`Discovered Broadlink RM device at ${d.host.address} (${d.host.macAddress})`)

  device = d;

  startPing()
})

const discoverDevices = (count = 0) => {
  discovering = true;

  if (count >= 5) {
    discovering = false;

    return;
  }

  broadlink.discover();
  count++;

  setTimeout(() => {
    discoverDevices(count);
  }, 5 * 1000)
}

const getBloadlinkDevice = () => {
  return device;
}

discoverDevices();

module.exports = getBloadlinkDevice;
