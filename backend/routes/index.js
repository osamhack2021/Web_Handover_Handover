const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/', (req, res) => {
    res.redirect('https://github.com/osamhack2021/Web_Handover_Handover/wiki/API-Reference');
});

router.post('/login', userController.login);


module.exports = router;