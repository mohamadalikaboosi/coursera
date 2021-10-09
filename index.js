// Setup Express
const express = require('express'),
    http = require('http');
const app = express();

// Packages
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Routers
const leaderRouter = require('./routes/leaderRouter');
const promoRouter = require('./routes/promoRouter');
const dishRouter = require('./routes/dishRouter');

// Information of Host
const hostName = 'localhost';
const port = 3000;

// Create Node Server
const server = http.createServer(app);

// Middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));


// Set Routes On Routes File
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);
app.use('/dishes', dishRouter);
// Default Page
app.use((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');
})

// Running Server
server.listen(port, hostName, () => {
    console.log(`Your Server Run at http://${hostName}:${port}/`);
});
