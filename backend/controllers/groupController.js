const groupService = require('../services/groupService.js');

const { ForbiddenError } = require('../services/errors/BussinessError');

const jwt = require('jsonwebtoken');
const SECRET_KEY = "MY_SECRET_KEY";

module.exports = {

    // GET
    search: async (req, res) => {
        const query = req.query;

        try {
            const result = await groupService.search(query);
            res.status(200).send(result);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // POST
    save: async (req, res) => {
        const params = req.body;

        try {
            const result = await groupService.save(params);

            res.status(201).send(result);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // PUT
    // group의 관리자일 경우에만 update 가능
    update: async (req, res) => {
        const params = req.body;
        const currUser = res.locals.serviceNumber;
        
        try {
            let group = await groupService.search({
                name: params.name,
                path: params.path
            });

            let adminNames = group[0].admins.map(admin => admin.name);
            if(adminNames.indexOf(currUser) < 0) {
                throw new ForbiddenError('Forbidden: 권한이 없습니다.');
            }

            const result = await groupService.update(params);
            if(result) res.status(204).send();
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    }
};