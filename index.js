const express = require('express'),
    http = require('http');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config');

// Host Info
const hostname = 'localhost';
const port = 3000;

// Create Server
const server = http.createServer(app);

// Setup Database
const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to database");
}, (err) => { console.log(err); });

// Middlewares
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

//Passport

//Routes
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const usersRouter = require('./routes/users');


app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);


// Error 404
app.all('*', (req, res, next) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('404 not found!');
});
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({status: err.status, message: err.message})
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
