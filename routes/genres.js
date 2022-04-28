const {Genre, validate} = require('../models/genre');
const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const {next} = require("lodash/seq");
const mongoose = require("mongoose");
const router = express.Router();

router.use(express.json());

// const genres = [
//     {id: 1, name: 'action'},
//     {id: 2, name: 'comedy'},
//     {id: 3, name: 'romance'},
//     {id: 4, name: 'drama'},
//     {id: 5, name: 'animation'},
//     {id: 6, name: 'musical'},
//     {id: 7, name: 'thriller'},
//     {id: 8, name: 'fantasy'},
//     {id: 9, name: 'western'},
//     {id: 10, name: 'war'}
// ];



router.get('/', asyncMiddleware (async (req, res) => {
        // throw new Error('Could not get the genres.');
        const genres = await Genre
            .find()
            .sort({name: 1});
        res.send(genres);
}));

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send('The genre with given id is not found.');

    res.send(genre);
});

router.post('/', auth, async (req, res) => {

    const { error } =validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({
        name: req.body.name
    });
    await genre.save();
    res.send(genre);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });

    if (!genre) return res.status(404).send('The genre with given id is not found.');

    // return the updated genre to the client
    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send('The genre with given id is not found');

    // return the same course
    res.send(genre);
});

// async function createGenre() {
//     const genre = new Genre({
//         gId: 10,
//         name: 'war',
//         isPublished: true
//     });
//
//     const result = await genre.save();
//     console.log(result);
// }

// createGenre();

module.exports = router;