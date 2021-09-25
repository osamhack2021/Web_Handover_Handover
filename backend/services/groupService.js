const Group = require('../models/Group.js');
const { MongoError } = require('mongoose');
const { RuntimeError } = require('./errors/RuntimeError.js');

module.exports = {
	search: async (query) => {
        try {
            let result = await Group.find(query)
                .populate('admins', {
                    id: true, serviceNumber: true, name: true, rank: true,
                    title: true, group: true, email: true, tel: true
                }).exec();

            return result;
        } catch(err) {
            throw new RuntimeError(err.message);
        }
    },

    create: async (params) => {
        try {
            let result = await Group.create(params);
            return result;
        } catch(err) {
            throw new RuntimeError(err.message);
        }
    },

    update: async (params) => {
        try {
            let updated = await Group.updateOne({
                name: params.name,
                path: params.path
            }, params);

            if(updated.modifiedCount > 0) {
                return true;
            }
            
        } catch(err) {
            throw new RuntimeError(err.message);
        }
    },

    delete: async (params) => {
        try {
            let deleted = await Group.deleteOne(params);
        } catch(err) {
            throw new RuntimeError(err.message);
        }
    }
};