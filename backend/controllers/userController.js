const userService = require('../services/userService.js');
const ControllerError = require('./ControllerError');

module.exports = {
    saveUser: async function(req, res, next) {
        try {
            let result = await userService.save(req.body);
            res.status(201).send(result);   // 201 Created
        } catch(err) {
            next(err);
        }
    },

    login: async function(req, res, next) {
        try {
            let result = await userService.auth(req.body);

            console.log(result);

            if(!!result) {
                req.session.loginData = req.body.serviceNumber;
                res.status(200).send('Login Success');   // 200 OK
            } else {
                throw new ControllerError('Login Failed');
            }
        } catch(err) {
            next(err);
        }
    }
};