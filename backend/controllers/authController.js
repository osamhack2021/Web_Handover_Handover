   
const authService = require('../services/authService.js');
const userService = require('../services/userService.js');

module.exports = {
    login: async function(req, res) {
        try {
            const token = await authService.login(req.body);
            const projection = {
                _id:true,
                serviceNumber: true,
                password:true,
                name:true,
                rank:true,
                title:true,
                status:true,
                group: true,
                email:true,
                tel: true,
                lastLogin:true,
                firstLogin:true,
                bookmarks:true,
                subscriptions:true
              };
            const user = await userService.findOne({serviceNumber:req.body.serviceNumber}, projection);

            res.cookie('jwt', token);
            res.status(200).send({
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
        res.status(200).send({
            result: 'OK',
        });
    }
}