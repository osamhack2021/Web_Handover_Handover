const itemService = require('../services/itemService.js');
const userService = require('../services/userService.js');

const jwt = require('jsonwebtoken');
const { BusinessError, NotFoundError, ForbiddenError } = require('../services/errors/BusinessError.js');
const SECRET_KEY = "MY_SECRET_KEY";

const algolia = require('../algolia/index');

module.exports = {

    // GET /item
    search: async (req, res) => {
        try {
            const keys = Object.keys(req.query);
            const valids = ['title', 'path', 'type', 'owner', 'group', 'page', 'tag'];

            // Only allowed fields are Searchable
            for(let key of keys) {
                if(!valids.includes(key))
                    throw new BusinessError(`${key} is not allowed param`);
            }            

            const result = await itemService.search(req.query);

            if(result.length < 1) throw new NotFoundError(`Not Found: No results were found for your search`);

            res.status(200).send(result);

        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // GET /item/algolia
    algoliaSearch: async (req, res) => {
        try {
            const query = req.params.query;

            const result = await algolia.search(query);

            if(result.hits.length < 1) throw new NotFoundError('Not Found');

            res.status(200).send(result.hits);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // GET /item/:item_id
    read: async (req, res) => {
        try {
            const item_id = req.params.item_id;

            const item = await itemService.read({ _id: item_id });

            if(item === null) throw new NotFoundError(`Not Found: No result is found for item_id: ${item_id}`);

            // Check session's read authority
            const user = await userService.searchByServiceNumber(res.locals.serviceNumber);
            if(!item.accessGroups.read.some(i => i.equals(user.group)))
                throw new ForbiddenError(`Forbidden: You are not in readable group`);

            res.status(200).send(item);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // POST /item
    create: async (req, res) => {
        try {
            let body = req.body;
            body.owner = res.locals._id;

            const result = await itemService.create(body);

            let object = result.toObject();
            object.objectID = object._id;
            delete object._id;

            algolia.saveObject(object);

            res.status(201).send(result);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // PUT /item/:item_id
    update: async (req, res) => {
        try {
            const item_id = req.params.item_id;

            let item = await itemService.read({ _id: item_id }, { populate: false });

            if(item === null) throw new NotFoundError(`Not Found: No result is found for item_id: ${item_id}`);

            // Check session's edit authority
            const user = await userService.searchByServiceNumber(res.locals.serviceNumber);
            //if(!item.accessGroups.edit.some(i => i.equals(user.group)))
               // throw new ForbiddenError(`Forbidden: You are not in editable group`);

            // Append Contributor
            item = Object.assign(item, { contributors: [...item.contributors, res.locals._id] });

            await itemService.update(item, req.body);

            res.status(204).send();
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // DELETE /item/:item_id
    delete: async (req, res) => {
        try {
            const item_id = req.params.item_id;

            let item = await itemService.read({ _id: item_id }, { populate: false });

            if(item === null)
                throw new NotFoundError(`Not Found: No result is found for item_id: ${item_id}`);
            
            let promises = [itemService.delete(item_id)];
            for(let historyItem of item.history) {
                promises.push(itemService.delete(historyItem));
            }

            // Waiting for removing all items;
            await Promise.all(promises);

            res.status(204).send();
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    
};
