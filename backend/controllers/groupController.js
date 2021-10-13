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
                    throw new BusinessError(`Invalid: ${key}로는 검색할 수 없습니다!`);
            }

            const result = await groupService.search(req.query);

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

            if(result === null) throw new NotFoundError(`NotFound: 검색결과가 없습니다.`);

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

            const group = await groupService.read({ _id: group_id });

            // Invalid group_id
            if(group === null) throw new NotFoundError(`NotFound: 검색결과가 없습니다.`);

            // Admin check
            if(!group.admins.some(admin => admin.equals(res.locals._id))) throw new ForbiddenError(`Forbidden: 그룹의 관리자만 수정할 수 있습니다.`);

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

            if(result === null) throw new NotFoundError(`Not Found: 검색결과가 없습니다.`);

            res.status(204).send();
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    
};