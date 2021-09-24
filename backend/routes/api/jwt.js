const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const SECRET_KEY = "MY_SECRET_KEY";

const { AuthError } = require('../../services/errors/BussinessError');

router.all('', (req, res, next) => {
    try {
        const clientToken = req.cookies.jwt;
        const decoded = jwt.verify(clientToken, SECRET_KEY);

        if(decoded) {
            res.locals.serviceNumber = decoded.serviceNumber;
            next();
        } else {
            let error = new Error('Authentication Failed: unauthorized');
            res.send(error.status).send(error.message);
        }
    } catch(err) {
        if(err instanceof AuthError) {
            res.send(err.status).send(err.message);
        } else {
            res.send(401).send('Authentication Failed: token expired');
        }
    }
});

module.exports = router;