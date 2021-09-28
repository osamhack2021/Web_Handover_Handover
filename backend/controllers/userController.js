const userService = require('../services/userService.js');
const authService = require('../services/authService.js');
module.exports = {

    search: async function(req, res) {

        // 활성화 상태의 유저만 조회
        let query = Object.assign(req.query, { status: 'avail' });
        let projection = {
            name: true, rank: true, title: true,
            group: true, email: true, tel: true
        };

        try {
            const result = await userService.search(query, projection);
            res.status(200).send(result);
        } catch(err) {
            res.status(err.status).send(err.message);
        }
    },

    save: async function(req, res) {
        try {
            const result = await userService.save(req.body);
            res.status(201).send(result);   // 201 Created
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