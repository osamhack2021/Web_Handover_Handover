const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const SECRET_KEY = "MY_SECRET_KEY";

router.all('', (req, res, next) => {
    try {
        const clientToken = req.cookies.jwt;
        const decoded = jwt.verify(clientToken, SECRET_KEY);

        console.log(clientToken);

        if(decoded) {
            res.locals.serviceNumber = decoded.serviceNumber;
            next();
        } else {
            res.status(401).send({ error: 'unauthorized' });
        }
    } catch(err) {
        res.status(401).json({ error: 'token expired' });
    }
});

module.exports = router;