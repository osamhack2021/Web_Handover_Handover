const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/', (req, res) => {
    res.render('../views/index');
});
router.post('/login', userController.login);


module.exports = router;