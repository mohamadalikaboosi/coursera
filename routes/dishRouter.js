const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Models
const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// /dishes
dishRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get(async (req, res, next) => {
        try {
            let dishes = await Dishes.find({});
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dishes);
        } catch (e) {
            next(e)
        }
    })
    .post(async (req, res, next) => {
        try {
            let dish = await Dishes.create(req.body);
            console.log('Dish Created ', dish);
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        } catch (e) {
            next(e)
        }
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(async (req, res, next) => {
        try {
            let resp = await Dishes.remove({})
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        } catch (e) {
            next(e)
        }
    });

// /dishes/:dishId
dishRouter.route('/:dishId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get(async (req, res, next) => {

        try {
            let dish = await Dishes.findById(req.params.dishId);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        } catch (e) {
            next(e);
        }

    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/' + req.params.dishId);
    })
    .put(async (req, res, next) => {
        try {
            let dish = await Dishes.findByIdAndUpdate(req.params.dishId, {
                $set: req.body
            }, {new: true});
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);

        } catch (e) {
            next(e);
        }
    })
    .delete(async (req, res, next) => {
        try {
            let resp = await Dishes.findByIdAndRemove(req.params.dishId);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);

        } catch (e) {

        }
    });

//------------------ /dishes/:dishId/comments--------------------//

dishRouter.route('/:dishId/comments')
    .get(async (req, res, next) => {

        try {
            let dish = await Dishes.findById(req.params.dishId);

            if (!dish) {
                let err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);

        } catch (e) {
            next(e);
        }
    })
    .post(async (req, res, next) => {

        try {
            let dish = await Dishes.findById(req.params.dishId);
            if (!dish) {
                let err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            let obj = {...req.body};
            dish.comments.push(obj);
            await dish.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);

        } catch (e) {
            next(e);
        }
    })
    .put((req, res, next) => {

        try {
            res.statusCode = 403;
            res.end('PUT operation not supported on /dishes/'
                + req.params.dishId + '/comments');
        } catch (e) {
            next(e);
        }

    })
    .delete(async (req, res, next) => {
        try {
            let dish = await Dishes.findById(req.params.dishId);
            if (!dish) {
                let err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            dish.comments = [];
            await dish.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);

        } catch (e) {
            next(e);
        }
    });

//---------- /dishes/:dishId/comments/:commentId-----------------//

dishRouter.route('/:dishId/comments/:commentId')
    .get(async (req, res, next) => {
        try {
            let dish = await Dishes.findById(req.params.dishId);
            if (!dish && !dish.comments.id(req.params.commentId)) {
                if (dish === null) {
                    let err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    let err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));

        } catch (e) {
            next(e);
        }
    })
    .post((req, res, next) => {
        try {
            res.statusCode = 403;
            res.end('POST operation not supported on /dishes/' + req.params.dishId
                + '/comments/' + req.params.commentId);
        } catch (e) {
            next(e);
        }

    })
    .put(async (req, res, next) => {
        try {
            let dish = await Dishes.findById(req.params.dishId);
            if (!dish && !dish.comments.id(req.params.commentId)) {
                if (dish === null) {
                    let err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    let err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }

            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            await dish.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);

        } catch (e) {
            next(e);
        }

    })
    .delete(async (req, res, next) => {
        try {
            let dish = await Dishes.findById(req.params.dishId);

            if (!dish && !dish.comments.id(req.params.commentId)) {
                if (dish === null) {
                    let err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    let err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }
            dish.comments.id(req.params.commentId).remove();
            await dish.save();

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);

        } catch (e) {
            next(e);
        }

    });

module.exports = dishRouter;
