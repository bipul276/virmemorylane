const internalIp = require("internal-ip");

async function printNetworkUrl() {
  const ip = await internalIp.v4();
  console.log(`🚀 Open on your network: https://${ip}:3000`);
}

printNetworkUrl();
