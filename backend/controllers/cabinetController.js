const itemService = require('../services/itemService.js');
const userService = require('../services/userService.js');

const jwt = require('jsonwebtoken');
const { NotFoundError, ForbiddenError } = require('../services/errors/BusinessError.js');
const SECRET_KEY = "MY_SECRET_KEY";

const isAdmin = (group, serviceNumber) => {
    let adminServiceNumbers = group.admins.map(admin => admin.serviceNumber);
    if(adminServiceNumbers.indexOf(serviceNumber) < 0) {
        return false;
    }
    return true;
}

module.exports = {

    // GET /item?=title
    search: async (req, res) => {

        // If Request /item without query, req.query.title is undefined
        // So allocate '' to const title
        const title = req.query.title || '';
        const _id = res.locals._id;

        try {

            // Get current session's group
            const currGroup = (await userService.search({ _id }))[0].group;

            // Search (partialTitle, type, readGroup)
            const result = await itemService.search(title, 'cabinet', currGroup);

            // If can't find cabinet, throw 404
            if(result.length < 1) throw new NotFoundError('Not Found');

            res.status(200).send(result);

        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // GET /item/:title
    read: async (req, res) => {

        // Parse title and path from req.params
        const title = req.params.title;
        const path = ',' + title + ',';

        try {

            // path is unique
            const result = await itemService.read(path);

            // If can't find cabinet, throw 404
            if(result.length < 1) throw new NotFoundError('Not Found');

            // Get current session's group
            const _id = res.locals._id;
            const currGroup = (await userService.search({ _id }))[0].group;

            // Check if session's group is accessable to cabinet
            const readable = result.accessGroups.read.some(reader => {
                return reader.equals(currGroup)
            });
            
            // If session's group can't read cabinet, throw 403
            if(!readable) throw new ForbiddenError('Forbidden');

            res.status(200).send(result);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // POST /item/:title
    create: async (req, res) => {

        // Parse title and path from req.params
        const title = req.params.title;
        const path = ',' + title + ',';

        // Add title and path to client's request body
        let query = Object.assign(req.body, {
            title,
            path,
            type: 'cabinet',
            owner: res.locals._id,
        });

        try {

            // Get current session's group
            const _id = res.locals._id;
            const currGroup = (await userService.search({ _id }))[0].group;

            // If client doesn't defined accessGroups,
            // Current session's group is automatically added.
            query = Object.assign(query, {
                accessGroups: {
                    read: query.accessGroups.read || [currGroup],
                    edit: query.accessGroups.edit || [currGroup]
                }
            });

            // Create item
            // Validation: path is unique
            const result = await itemService.create(query);

            // 204 No Content
            res.status(204).send(result);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // PUT
    update: async (req, res) => {
        try {

        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // DELETE
    delete: async (req, res) => {

    },

    
};
