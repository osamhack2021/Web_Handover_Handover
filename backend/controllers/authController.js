const authService = require('../services/authService.js');
const userService = require('../services/userService.js');

module.exports = {
    login: async function(req, res) {
        try {
            const token = await authService.login(req.body);
            const user = await userService.findOne({userService:req.body.serviceNumber}, {serviceNumber:true,name: true});
            
            res.cookie('jwt', token);
            res.status(201).send({
                result: 'OK',
                user,
                token
            });

        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    logout: async function(req, res) {
        res.cookie('jwt', '');
        res.status(201).send({
            result: 'OK',
        });
    }
}