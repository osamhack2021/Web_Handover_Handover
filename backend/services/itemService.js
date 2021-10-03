const Item = require('../models/Item.js');
const { MongoError, Types } = require('mongoose');
const { BusinessError } = require('./errors/BusinessError.js');

const LIMIT = 20;

module.exports = {
    search: async (query = {}) => {
        try {
            const projection = {
                title: true, path: true, type: true,
                owner: true, tags: true, history: true,
                status: true, inspection: true, created: true
            };

            if(query.group) {
                query['accessGroups.read'] = { $eq: query.group };
                delete query.group;
            }

            if(query.tag) {
                query.tags = { $eq: query.tag };
                delete query.tag;
            }

            // Exclude deleted or modified items
            query.status = {
                $nin: ['deleted', 'modified']
            };

            let query_ = Item.find(query, projection);

            query_.sort('created');

            query_.populate({
                path: 'owner',
                select: ['rank', 'name']
            });

            query_.skip(query_.page * LIMIT).limit(LIMIT);

            return await query_.exec();

        } catch(err) {
            throw new BusinessError(err.message);
        }
    },

	read: async (_id, options = { populate: true }) => {
        try {
            let query = Item.findOne({ _id });

            if(options.populate) {
                query.populate([{
                    path: 'accessGroups.read',
                    select: ['name', 'path']
                }, {
                    path: 'accessGroups.edit',
                    select: ['name', 'path']
                }, {
                    path: 'owner',
                    select: ['rank', 'name']
                }]);
            }

            return await query.exec();
        } catch(err) {
            throw new BusinessError(err.message);
        }
    },

    create: async (payload) => {
        try {
            const result = await Item.create(payload);
            return result;
        } catch(err) {
            throw new BusinessError(err.message);
        }
    },

    update: async (item, payload) => {
        try {

            // Create previous item
            previous_item = item.toObject();
            previous_item = Object.assign(previous_item, { status: 'modified' });
            delete previous_item._id;
            previous_item = await Item.create(previous_item);

            // Append history
            payload.history = [...item.history, previous_item._id];

            // Clear inspection
            payload.inspection = {};

            // Update item
            await Item.findOneAndUpdate(item, payload)

            return result;
        } catch(err) {
            throw new BusinessError(err.message);
        }
    },

    delete: async (_id) => {
        try {
            return Item.findOneAndDelete({ _id });
        } catch(err) {
            throw new BusinessError(err.message);
        }
    }
};
