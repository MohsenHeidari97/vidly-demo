const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to VIDLY Movie Rent Service');
});

module.exports = router;