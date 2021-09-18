const express = require('express');
const router = express.Router();
const UserService = require('../../services/UserService.js');

router.post('', (req, res) => {
    UserService.save(req.body)
        .then(result => res.send(result));
});

router.get('', (req, res) => {
    UserService.findAll()
        .then(result => res.send(result));
});

router.get('/:id', (req, res) => {
    UserService.findAll(req.params.id)
        .then(result => res.send(result));
});

module.exports = router;