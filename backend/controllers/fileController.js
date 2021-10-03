const { BusinessError, ForbiddenError, NotFoundError } = require('../services/errors/BusinessError');

const jwt = require('jsonwebtoken');
const SECRET_KEY = "MY_SECRET_KEY";

module.exports = {

    // GET /file/:file_name
    read: async (req, res) => {
        try {
            // Todo
            // Reading files
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

    // POST /file
    create: async (req, res) => {
        try {
            // Todo
            // Saving files
        } catch(err) {
            res.status(err.status || 500).send(err.message);
        }
    },

};