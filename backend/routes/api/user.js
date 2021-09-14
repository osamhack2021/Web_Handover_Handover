const express = require('express');
const router = express.Router();
const User = require('../../models/User.js');

router.post('/user/create', (req, res) => {
    let body = req.body;

    User.create(body)
        .then(user => res.send(user))
        .catch(err => res.status(500).send(err));
});

module.exports = router;