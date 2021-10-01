const Group = require('../models/Group.js');
const { Types } = require('mongoose');
const { RuntimeError } = require('./errors/RuntimeError.js');

module.exports = {
    search: async (query) => {
        const projection = { name: true, path: true };

        if(!query) {
            return await Group.find({}, projection);
        }

        if(query.admin) {
            query.admins = { $eq: query.admin };
            delete query.admin;
        }
        
        return await Group.find(query, projection);
    },

	  read: async (query, projection = { name: true, path: true }) => {
        try {
            return await Group.findOne(query, projection);
        } catch(err) {
            throw new RuntimeError(err.message);
        }
    },
    
    read: async (query, projection = { name: true, path: true }) => {
        try {
            return await Group.findOne(query, projection);
        } catch(err) {
            throw new RuntimeError(err.message);
        }
    },

    create: async (payload) => {
        try {
            return await Group.create(payload);
        } catch(err) {
            throw new RuntimeError(err.message);
        }
    },

    update: async (_id, payload) => {
        try {
            return await Group.findOneAndUpdate({ _id }, payload);
        } catch(err) {
            throw new RuntimeError(err.message);
        }
    },

    delete: async (_id) => {
        try {
            return await Group.findOneAndDelete({ _id });
        } catch(err) {
            throw new RuntimeError(err.message);
        }
    }
};