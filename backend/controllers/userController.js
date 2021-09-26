const userService = require('../services/userService.js');

const jwt = require('jsonwebtoken');
const SECRET_KEY = "MY_SECRET_KEY";

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

            if(result) {
                
                const token = jwt.sign({
                    serviceNumber: result.serviceNumber
                }, SECRET_KEY, {
                    expiresIn: '1h'
                });

                console.log(token)

                res.cookie('jwt', token);

                res.status(201).send({
                    result: 'OK',
                    token
                });
            }

        } catch(err) {
            console.log(err);
           res.status(err.status).send(err.message);
        }
    }
};