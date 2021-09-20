let { MongoError } = require('mongodb');
const ControllerError = require('./controllers/ControllerError');

function errorHandler(error, req, res, next) {

    if(error === '404 Not Found') {
        let message = 'Not Found';
        res.status(404).json({ message });
    }    
    else if(error instanceof MongoError) {

        // E11000 duplicate key error
        if(error.code === 11000) {
            let uniqueKeys = Object.keys(error.keyPattern).join(', ');
            let keyValue = JSON.stringify(error.keyValue);

            let message = `'${uniqueKeys} is(are) unique, ${keyValue}`;

            res.status(400).send({ message });
        }
    }
    else if(error instanceof ControllerError) {

        // ...
        if(error.message === 'Login Failed') {
            let message = error.message + `: Invalid serviceNumber of password`;
            res.status(401).send({ message });
        }
    }
    
    // ServerError
    else {
        res.status(500).send(error);
    }
}

module.exports = errorHandler;