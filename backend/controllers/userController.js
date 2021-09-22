const userService = require('../services/userService.js');

module.exports = {
    saveUser: async function(req, res) {
        try {
            const result = await userService.save(req.body);
            res.status(201).send(result);   // 201 Created
        } catch(err) {
            res.status(err.status).send(err.message);
        }
    },

    login: async function(req, res) {
        try {
            const result = await userService.auth(req.body);

            req.session.loginData = req.body.serviceNumber;
            res.status(200).send('Login Success');

        } catch(err) {
            console.log(err);
           res.status(err.status).send(err.message);
        }
    }
};