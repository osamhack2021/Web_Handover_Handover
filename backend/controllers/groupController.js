const groupService = require('../services/groupService.js');

const { BusinessError, ForbiddenError, NotFoundError } = require('../services/errors/BusinessError');

module.exports = {

    // GET /group
    search: async (req, res) => {
        try {
            const keys = Object.keys(req.query);
            const valids = ['name', 'path', 'admin'];
            
            // Only allowed fields are Searchable
            for(let key of keys) {
                if(!valids.includes(key))
                    throw new BusinessError(`${key} is not allowed param`);
            }

            const result = await groupService.search(req.query);

            if(result.length < 1) throw new NotFoundError(`Not Found: No results were found for your search`);

            res.status(200).send(result);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // GET /group/:group_id
    read: async (req, res) => {
        try {
            const group_id = req.params.group_id;

            const result = await groupService.read({ _id: group_id });

            if(result === null) throw new NotFoundError(`Not Found: No result is found for group_id: ${group_id}`);

            res.status(200).send(result);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // POST /group
    create: async (req, res) => {
        try {

            // If Request /group without admins,
            // Allocate '' to body.admins
            let body = req.body;
            body.admins = req.body.admins.length > 0 ? req.body.admins : [res.locals._id];

            const result = await groupService.create(body);
            
            res.status(201).send(result);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // PUT /group/:group_id
    update: async (req, res) => {
        try {
            const group_id = req.params.group_id;

            const projection = {
                name: true, path: true,
                admins: true
            };
            const group = await groupService.read({ _id: group_id }, projection);

            // Invalid group_id
            if(group === null) throw new NotFoundError(`Not Found: No result is found for group_id: ${group_id}`);

            // Admin check
            if(!group.admins.some(admin => admin.equals(res.locals._id))) throw new ForbiddenError(`Forbidden: You are not admin of this group`);

            await groupService.update(group_id, req.body);

            res.status(204).send();
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // DELETE /group/:group_id
    delete: async (req, res) => {
        try {
            const group_id = req.params.group_id;
            
            let result = await groupService.delete(group_id);

            if(result === null) throw new NotFoundError(`Not Found: No result is found for group_id: ${group_id}`);

            res.status(204).send();
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    
};