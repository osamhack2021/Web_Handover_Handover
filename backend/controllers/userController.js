const userService = require('../services/userService.js');

module.exports = {
    saveUser: async function(req, res) {
        try {
            let result = await userService.save(req.body);
            res.send(result);
        } catch(err) {
            res.status(403).send(err);
        }
    }
};