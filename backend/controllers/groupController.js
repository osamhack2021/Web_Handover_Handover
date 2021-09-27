const groupService = require('../services/groupService.js');
const { Types } = require('mongoose');

const { ForbiddenError, NotFoundError } = require('../services/errors/BusinessError');

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

    searchAll: async (req, res) => {
        try {
            const result = await groupService.search('');

            if(result.length < 1) throw new NotFoundError('Not Found');

            res.status(200).send(result);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // GET
    search: async (req, res) => {
        try {
        const groups = [req.params.group, ...req.params['0'].split('/').slice(1)];
        const path = ',' + groups.join(',') + ',';
        
        const result = await groupService.search('^' + path);

        if(result.length < 1) throw new NotFoundError('Not Found');

        res.status(200).send(result);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }

    },

    // POST
    create: async (req, res) => {
        const name = req.params.group;
        const groups = [req.params.group, ...req.params['0'].split('/').slice(1)];
        const path = ',' + groups.join(',') + ',';

        let admins = req.body.admins || [res.locals._id];
        admins = admins.map(admin => Types.ObjectId(admin));

        let inspectors = req.body.inspectors || [];
        inspectors = inspectors.map(inspector => Types.ObjectId(inspector));

        const query = {
            name, path, admins, inspectors
        };

        try {
            const result = await groupService.create(query);

            res.status(201).send(result);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // PUT
    update: async (req, res) => {
        const name = req.params.group;
        const groups = [req.params.group, ...req.params['0'].split('/').slice(1)];
        const path = ',' + groups.join(',') + ',';
        
        let admins = req.body.admins || [res.locals._id];
        admins = admins.map(admin => Types.ObjectId(admin));

        let inspectors = req.body.inspectors || [];
        inspectors = inspectors.map(inspector => Types.ObjectId(inspector));

        const query = {
            name, path, admins, inspectors
        };

        try {
            let group = (await groupService.search(`^${path}$`))[0];

            if(!isAdmin(group, res.locals.serviceNumber))
                throw new ForbiddenError('Forbidden: 권한이 없습니다.');

            const result = await groupService.update(query);
            if(result) res.status(204).send();
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    delete: async (req, res) => {
        const name = req.params.group;
        const groups = [req.params.group, ...req.params['0'].split('/').slice(1)];
        const path = ',' + groups.join(',') + ',';
        
        let admins = req.body.admins || [];
        admins = admins.map(admin => Types.ObjectId(admin));

        let inspectors = req.body.inspectors || [];
        inspectors = inspectors.map(inspector => Types.ObjectId(inspector));

        const query = {
            name, path, admins, inspectors
        };

        try {
            let group = (await groupService.search(`^${path}$`))[0];

            if(!isAdmin(group, res.locals.serviceNumber))
                throw new ForbiddenError('Forbidden: 권한이 없습니다.');
            
            const result = await groupService.delete({ path });
            if(result) res.status(204).send();
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    
};