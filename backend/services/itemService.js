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

	read: async (path) => {
        try {
            const result = await Item.findOne({
                path,
                status: {
                    $not: {
                        $regex: new RegExp('deleted|modified')
                    }
                }
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

    update: async (before, to) => {
        try {

            // Before's status change
            await Item.findOneAndUpdate({ _id: before._id }, { status: 'modified' });

            // Append history
            to = Object.assign(to, { history: [...before.history, before._id]});

            // Copy Item
            let item = Object.assign(before, to).toJSON();
            delete item._id

            // console.log(item.contributors[0], item.contributors[0].toString)

            // Making unique array
	    // Before: ["615435c9f19accbc765bdc10", "615435c9f19accbc765bdc10", "615435c9f19accbc765bdc10"]
            // After:  ["615435c9f19accbc765bdc10"]
            item.contributors = [...new Set(item.contributors.map(obj => obj.toString()))]
                                .map(str => {
                                    return item.contributors.find(c => c.toString() === str);
                                });
            if(item.accessGroups) {
                item.accessGroups = {
                    read: [...new Set(item.accessGroups?.read.map(obj => obj.toString()))]
                            .map(str => {
                                return item.accessGroups.read.find(r => r.toString() === str)
                            }),
                    edit: [...new Set(item.accessGroups?.edit.map(obj => obj.toString()))]
                            .map(str => {
                                return item.accessGroups.edit.find(e => e.toString() === str)
                            }),
                };
            }

            item = new Item(item);
            
            const result = await item.save();
            return result;
        } catch(err) {
            throw new BusinessError(err.message);
        }
    },

    delete: async (params) => {
        
    }
};
