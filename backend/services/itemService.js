const Item = require('../models/Item.js');
const { MongoError, Types } = require('mongoose');
const { RuntimeError } = require('./errors/RuntimeError.js');
const { BusinessError } = require('./errors/BusinessError.js');

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
            throw new BusinessError(err.message);
        }
    },

	read: async (path) => {
        try {
            const result = await Item.findOne({
                path
            }).populate('accessGroups.read', {
                _id: true, name: true, path: true
            }).populate('accessGroups.edit', {
                _id: true, name: true, path: true
            }).populate('owner', {
                _id: true, serviceNumber: true, name: true,
                rank: true, title: true, email: true, tel: true
            }).exec();

            return result;
        } catch(err) {
            throw new BusinessError(err.message);
        }
    },

    create: async (query) => {
        try {
            const result = await Item.create(query);
            return result;
        } catch(err) {
            throw new BusinessError(err.message);
        }
    },

    update: async (params) => {
        try {
            
        } catch(err) {
            throw new BusinessError(err.message);
        }
    },

    delete: async (params) => {
        
    }
};