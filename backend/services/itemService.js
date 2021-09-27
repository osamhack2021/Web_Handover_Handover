const Item = require('../models/Item.js');
const { MongoError, Types } = require('mongoose');
const { RuntimeError } = require('./errors/RuntimeError.js');

module.exports = {
    search: async (title, type, readerGroup) => {
        try {
            title = new RegExp(title);
            let result = await Item.find({
                title,
                type,
                'accessGroups.read': {
                    $elemMatch: { $eq: readerGroup }
                },
                status: { $ne: 'deleted' }
            }).populate('accessGroups.read', {
                _id: true, name: true, path: true
            }).populate('owner', {
                _id: true, serviceNumber: true, name: true,
                rank: true, title: true, email: true, tel: true
            }).exec();

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