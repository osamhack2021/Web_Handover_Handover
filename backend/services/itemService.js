const Item = require('../models/Item.js');
const { MongoError, Types } = require('mongoose');
const { RuntimeError } = require('./errors/RuntimeError.js');

module.exports = {
    search: async (title, type, readerGroup) => {
        try {
            title = new RegExp(title);
            console.log({ title, type, readerGroup })
            let result = await Item.find({
                title,
                type,
                'accessGroups.read': {
                    $elemMatch: { $eq: readerGroup }
                },
                status: { $ne: 'deleted' }
            });

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