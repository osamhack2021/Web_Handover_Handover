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
        const title = req.query.title || '';
        const _id = res.locals._id;

        try {
            const currGroup = (await userService.search({ _id }))[0].group;
            const result = await itemService.search(title, 'cabinet', currGroup);

            if(result.length < 1) throw new NotFoundError('Not Found');

            res.status(200).send(result);

        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // GET /item/:title
    read: async (req, res) => {
        try {
            const title = req.params.title;
            const path = ',' + title + ',';

            const result = await itemService.read(path);
            if(result.length < 1) throw new NotFoundError('Not Found');

            const _id = res.locals._id;
            const currGroup = (await userService.search({ _id }))[0].group;

            const readable = result.accessGroups.read.some(reader => {
                return reader.equals(currGroup)
            });
            
            if(!readable) throw new ForbiddenError('Forbidden');

            res.status(200).send(result);
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // POST
    create: async (req, res) => {
        try {

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