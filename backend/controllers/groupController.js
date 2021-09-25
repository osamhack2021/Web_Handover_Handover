const groupService = require('../services/groupService.js');

const { ForbiddenError } = require('../services/errors/BussinessError');

const jwt = require('jsonwebtoken');
const SECRET_KEY = "MY_SECRET_KEY";

const isAdmin = (group, serviceNumber) => {
    let adminServiceNumbers = group.admins.map(admin => admin.serviceNumber);
    if(adminServiceNumbers.indexOf(serviceNumber) < 0) {
        return false;
    }
    return true;
}

module.exports = {

    // GET
    search: async (req, res) => {
        const query = req.query;

        try {
            const result = await groupService.search(query);

            if(result.length < 1) res.status(404).send('NotFound');

            res.status(200).send(result);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // POST
    create: async (req, res) => {
        let params = req.body;

        if(!params.admins) {
            let serviceNumber = res.locals.serviceNumber;
            let id = groupService.find({serviceNumber})[0].id

            params.admins = [id];
        }

        try {
            const result = await groupService.create(params);

            res.status(201).send(result);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // PUT
    // group의 관리자일 경우에만 update 가능
    update: async (req, res) => {
        const params = req.body;
        const serviceNumber = res.locals.serviceNumber;
        
        try {
            let group = (await groupService.search({
                name: params.name,
                path: params.path
            }))[0];

            if(!isAdmin(group, serviceNumber))
                throw new ForbiddenError('Forbidden: 권한이 없습니다.');

            const result = await groupService.update(params);
            if(result) res.status(204).send();
        } catch(err) {
            console.log(err)
            res.status(err.status || 500).send(err.message);
        }
    },

    delete: async (req, res) => {
        try {
            let group = (await groupService.search({
                name: params.name,
                path: params.path
            }))[0];

            if(!isAdmin(group, serviceNumber))
                throw new ForbiddenError('Forbidden: 권한이 없습니다.');
            
            const result = await groupService.delete(params);
            if(result) res.status(204).send();
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    
};