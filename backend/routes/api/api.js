const express = require('express');
const router = express.Router();
const User = require('../../models/User.js');

router.get('/createUser/:id', (req, res) => {
    User.create( { 
        id: req.params.id,
        password: 'rootroot',
        name: req.params.id,
        email: req.params.id + '@test.com',
        serviceStart: new Date()
    })
    .then(user => res.send(user))
    .catch(err => res.status(500).send(err));
});

module.exports = router;