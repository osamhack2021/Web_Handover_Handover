const express = require('express');
const router = express.Router();
const userService = require('../../services/userService.js');
const userController = require('../../controllers/userController.js');

router.post('', userController.saveUser);

router.get('', (req, res) => {
    userService.findAll()
        .then(result => res.send(result));
});

router.get('/:id', (req, res) => {
    userService.findAll(req.params.id)
        .then(result => res.send(result));
});

router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;