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
            const token = await userService.auth(req.body);
            
            res.cookie('jwt', token);
            res.status(201).send({
                result: 'OK',
                token
            });

        } catch(err) {
           res.status(err.status).send(err.message);
        }
    },

    updateUser: async function(req, res) {
        try {
            const result = await userService.update(req.params.id,req.body);
            res.status(201).send(result);   // 201 Created
        } catch(err) {
            res.status(err.status).send(err.message);
        }
    },

    deleteUser: async function(req, res) {
        try {
            const result = await userService.delete(req.params.id);
            res.status(204).send(result);   // 201 Created
        } catch(err) {
            res.status(err.status).send(err.message);
        }
    }
};