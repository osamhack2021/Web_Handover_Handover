const Item = require('../models/Item.js');
const { MongoError } = require('mongoose');
const { RuntimeError } = require('./errors/RuntimeError.js');

module.exports = {
    search: async (title, type, owner) => {
        try {
            title = new RegExp('^' + title);
            console.log({ title, type })
            let result = await Item.find({ title, type });

            return result;
        } catch(err) {
            throw new RuntimeError(err.message);
        }
    },

	read: async (query) => {
        try {

        } catch(err) {
            throw new RuntimeError(err.message);
        }
    },

    create: async (params) => {
        try {
            
        } catch(err) {
            throw new RuntimeError(err.message);
        }
    },

    update: async (params) => {
        try {
            
        } catch(err) {
            throw new RuntimeError(err.message);
        }
    },

    delete: async (params) => {
        
    }
};