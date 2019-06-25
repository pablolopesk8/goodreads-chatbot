const localtunnel = require('localtunnel');
localtunnel(3003, { subdomain: 'pablolopesk8' }, (err, tunnel) => {
    if (err)
        console.log(`LT error: ${err}`)
    
    console.log(`LT running in: ${tunnel.url}`)
});