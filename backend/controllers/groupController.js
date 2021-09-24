const groupService = require('../services/groupService.js');

const jwt = require('jsonwebtoken');
const SECRET_KEY = "MY_SECRET_KEY";

module.exports = {

    // GET
    search: async (req, res) => {
        let query = req.query;

        try {
            const result = await groupService.search(query);
            res.status(200).send(result);
        } catch(err) {
            res.status(500).send(err.message);
        }
    },

    // POST
    save: async (req, res) => {
        let params = req.body;

        console.log(params)

        try {
            const result = await groupService.save(params);

            res.status(201).send(result);
        } catch(err) {
            res.status(500).send(err.message);
        }
    },


};