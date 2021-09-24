const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const SECRET_KEY = "MY_SECRET_KEY";

const { AuthError } = require('../../services/errors/BusinessError');

router.all('', (req, res, next) => {
    try {
        const clientToken = req.cookies.jwt;
        const decoded = jwt.verify(clientToken, SECRET_KEY);

        console.log(clientToken);

        if(decoded) {
            res.locals.serviceNumber = decoded.serviceNumber;
            next();
        } else {
            let error = new Error('Authentication Failed: unauthorized');
            res.send(error.status).send(error.message);
        }
    } catch(err) {
        let error = new Error('Authentication Failed: token expired');
        res.send(error.status).send(error.message);
    }
});

module.exports = router;