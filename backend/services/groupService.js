const Group = require('../models/Group.js');
const { RuntimeError } = require('./errors/RuntimeError.js');

module.exports = {
	search: async (query) => {
        try {
            let result = await Group.find(query)
                .populate('admins', {
                    serviceNumber: true, name: true, rank: true, title: true,
                    group: true, email: true, tel: true
                }).exec();

            return result;
        } catch(err) {
            throw err;
        }
    },

    save: async (params) => {
        try {
            let result = await Group.create(params);
            return result;
        } catch(err) {
            console.log(err)
            throw new RuntimeError(err.message);
        }
    }
};