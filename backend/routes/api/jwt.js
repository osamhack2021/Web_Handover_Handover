const express = require('express');
const router = express.Router();
const authService = require('../../services/authService.js');

const { Types } = require('mongoose');

router.all('', (req, res, next) => {
    try {
        const clientToken = req.cookies.jwt;
        const loginUser = authService.getLoginUser(clientToken);

        res.locals.serviceNumber = loginUser.serviceNumber;
        res.locals._id = Types.ObjectId(loginUser._id);
        res.locals.group = Types.ObjectId(loginUser.group);
        res.locals.status = loginUser.status;

        next();
    } catch(err) {
        console.log(err);
        res.status(err.status).send(err.message);
    }
});

router.all('/admin/*', (req, res, next) => {
    try {
        const clientToken = req.cookies.jwt;
        const loginUser = authService.authAdmin(clientToken);

        res.locals.serviceNumber = loginUser.serviceNumber;
        res.locals._id = Types.ObjectId(loginUser._id);

        next();
    } catch(err) {
        console.log(err);
        res.status(err.status).send(err.message);
    }
});

module.exports = router;