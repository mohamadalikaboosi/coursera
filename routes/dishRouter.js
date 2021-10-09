// Packages
const express = require('express');
const bodyParser = require('body-parser');

// SetUp Route
const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

// /dishes
dishRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the dishes to you!');
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete((req, res, next) => {
        res.end('Deleting all dishes');
    });

// /dishes/:dishId
dishRouter.route('/:dishId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send details of the dish: ' + req.params.dishId + ' to you!');
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/' + req.params.dishId);
    })
    .put((req, res, next) => {
        res.end(`Updating the dish: ${req.params.dishId}\nWill update the dish: ${req.body.name} with details: ${req.body.description}`);
    })
    .delete((req, res, next) => {
        res.end(`Deleting dish: ${req.params.dishId}`);
    })

module.exports = dishRouter;
