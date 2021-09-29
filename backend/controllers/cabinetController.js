const itemService = require('../services/itemService.js');
const userService = require('../services/userService.js');

const jwt = require('jsonwebtoken');
const { NotFoundError, ForbiddenError } = require('../services/errors/BusinessError.js');
const Item = require('../models/Item.js');
const SECRET_KEY = "MY_SECRET_KEY";

module.exports = {

    // GET /item?=title
    search: async (req, res) => {

        // If GET request contains no query, req.query.title will be undefined
        // Allocating empty string to the title if it is undefined will prevent unexpected behaviors
        const title = req.query.title || '';
        const _id = res.locals._id;

        try {

            // Get current session's group
            const currGroup = (await userService.search({ _id }))[0].group;

            // Search (partialTitle, type, readGroup)
            const result = await itemService.search(title, 'cabinet', currGroup);

            // If cabinet is not found, throw 404
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
            
            // If session.accessGroups is not authorized to read the cabinet, throw HTTP 403
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
                    read: query.accessGroups?.read || [currGroup],
                    edit: query.accessGroups?.edit || [currGroup]
                },
                contributors: [_id]
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

    // PUT /item/:title
    update: async (req, res) => {

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

            let before = await itemService.read(path);
            console.log(before)
            if(!before) throw new NotFoundError('Not Found');

            // If session.accessGroups is not authorized to edit the cabinet, throw HTTP 403
            const editable = before.accessGroups.edit.some(editor => {
                return editor.equals(currGroup);
            });
            if(!editable) throw new ForbiddenError('Forbidden');
            
            // Add currUser to contributors
            query = Object.assign(query, { contributors: [...before.contributors, res.locals._id] });

            // Remove inspection
            query = Object.assign(query, { inspection: [] });

            // Update Item
            const result = await itemService.update(before, query);

            // 204 No Content
            res.status(204).send(result);

        } catch(err) {
            console.log(err);
            res.status(err.status || 500).send(err.message);
        }
    },

    // DELETE /item/:title
    delete: async (req, res) => {

        // Parse title and path from req.params
        const title = req.params.title;
        const path = ',' + title + ',';

        try {
            // Get current session's group
            const _id = res.locals._id;
            const currGroup = (await userService.search({ _id }))[0].group;

            let item = await itemService.read(path);
            if(!item) throw new NotFoundError('Not Found');

            // If session.accessGroups is not authorized to remove the cabinet, throw HTTP 403
            const removable = item.accessGroups.edit.some(remover => {
                return remover.equals(currGroup);
            });
            if(!removable) throw new ForbiddenError('Forbidden');

            await itemService.delete(item);

            res.status(204).send();
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    
};
