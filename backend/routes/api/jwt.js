const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const SECRET_KEY = "MY_SECRET_KEY";

const { AuthError } = require('../../services/errors/BusinessError');

router.all('', (req, res, next) => {
    try {
        const clientToken = req.cookies.jwt;
        const decoded = jwt.verify(clientToken, SECRET_KEY);

        if(decoded) {
            res.locals.serviceNumber = decoded.serviceNumber;
            next();
        } else {
            let error = new Error('Authentication Failed: unauthorized');
            res.status(error.status || 500).send(error.message);
        }
    } catch(err) {
        if(err instanceof AuthError) {
            res.status(err.status || 500).send(err.message);
        } else {
            res.status(401).send('Authentication Failed: token expired');
        }
    }
});

module.exports = router;