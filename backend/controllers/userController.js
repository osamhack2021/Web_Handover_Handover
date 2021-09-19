const userService = require('../services/userService.js');

module.exports = {
    saveUser: async function(req, res) {
        try {
            let result = await userService.save(req.body);
            res.status(201).send(result);
        } catch(err) {
            res.status(403).send(err);
        }
    },

    login: async function(req, res) {
        try {
            let result = await userService.auth(req.body);
            if(result) {
                req.session.loginData = req.body.serviceNumber;
                res.status(201).send(result);
            }
        }catch(err) {
            res.status(403).send(err);
        }
    }
};