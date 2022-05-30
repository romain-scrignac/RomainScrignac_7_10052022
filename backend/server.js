require('dotenv').config();
const app = require('./app');
const fs = require('fs');
const http = require('http');
const https = require('https');

const normalizePort = val => {
    const port = parseInt(val, 10);
    const port2 = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (isNaN(port2)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    if (port2 >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT);
const port2 = normalizePort(process.env.PORT2);

app.set('port', port);
app.set('port2', port2);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    // const address = server.address();
    // const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    let bind;
    if (port) {
        bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    } else if (port2) {
        bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port2;
    }
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Creating object of key and certificate
// for SSL
const options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
};

https.createServer(options, app)
    .listen(port)
    .on('error', errorHandler)
    .on('listening', () => {
        //const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
        console.log('Listening on port 8000');
    });
    
http.createServer(app)
    .listen(port2)
    .on('error', errorHandler)
    .on('listening', () => {
        //const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port2;
        console.log('Listening on port 3000');
    });

// server.on('error', errorHandler);
// server.on('listening', () => {
//     const address = server.address();
//     const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
//     console.log('Listening on ' + bind);
// });

// server.listen(port);