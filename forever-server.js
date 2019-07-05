const localtunnel = require('localtunnel');
const config = require('./src/config');
localtunnel(config.portApi, { subdomain: config.localtunnelSubdomain }, (err, tunnel) => {
    if (err)
        console.log(`LT error: ${err}`)
    
    console.log(`LT running in: ${tunnel.url}`)
});