const express = require('express');
const asyncMiddleware = require("../middleware/async");
const {Genre} = require("../models/genre");
const {Rental} = require("../models/rental");
const {Movie} = require("../models/movie");
const auth = require('../middleware/auth');
const moment = require('moment');
const Joi = require("joi");
const router = express.Router();

router.post('/', auth, async (req, res) => {
    if (!req.body.customerId) return res.status(400).send('customerId is not provided');
    if (!req.body.movieId) return res.status(400).send('movieId is not provided');

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental) return res.status(404).send('Rental not found');

    if (rental.dateReturned) return res.status(400).send('Return already processed');

    rental.return();
    await rental.save();

    await Movie.update({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

    return res.send(rental);
});

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.ObjectId().required(),
        movieId: Joi.ObjectId().required()
    });
    return schema.validate(req);
}

module.exports = router;