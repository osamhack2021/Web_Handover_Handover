const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController.js');

router.get('', userController.search);
router.post('', userController.save);

router.get('/:id', (req, res) => {
    userService.findAll(req.params.id)
        .then(result => res.send(result));
});

router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;