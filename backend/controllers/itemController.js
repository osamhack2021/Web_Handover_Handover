const itemService = require('../services/itemService.js');
const userService = require('../services/userService.js');

const jwt = require('jsonwebtoken');
const { NotFoundError, ForbiddenError } = require('../services/errors/BusinessError.js');
const SECRET_KEY = "MY_SECRET_KEY";

module.exports = {

    // GET /item
    search: async (req, res) => {
        try {

        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // GET /item/:item_id
    read: async (req, res) => {
        try {

        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // POST /item
    create: async (req, res) => {
        try {

        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // PUT /item/:item_id
    update: async (req, res) => {
        try { 

        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // DELETE /item/:item_id
    delete: async (req, res) => {
        try {

        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    
};
