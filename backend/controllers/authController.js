const authService = require('../services/authService.js');

module.exports = {
    login: async function(req, res) {
        try {
            const token = await authService.auth(req.body);
            
            res.cookie('jwt', token);
            res.status(201).send({
                result: 'OK',
                token
            });

        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    }
}