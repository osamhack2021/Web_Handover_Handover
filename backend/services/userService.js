const User = require('../models/User.js');

const crypto = require('crypto');
let shasum;

module.exports = {
	save: async function(params) {
		try {
			shasum = crypto.createHash('sha256');
			params.password = shasum.digest(params.password);

			let result = await User.create(params);
			result._id = '';
			result.password = '';

			return result;
		} catch(err) { throw err; }
	},
	
	findAll: async function() {
		try {
			return await User.findAll();
		} catch(err) { throw err; }
	},

	auth: async function(params) {
		try {
			shasum = crypto.createHash('sha256');
			params.password = shasum.digest(params.password);

			const loginUser = await User.findOneByServiceNumber(params.serviceNumber);

			if(loginUser === null) {
				return false;
			}
			
			if(loginUser.password != params.password) {
				return false;
			}

			return true;
		} catch(err) { throw err; }
	}
};