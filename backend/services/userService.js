const User = require('../models/User.js');

const crypto = require('crypto');
function encode(rowPassword) {
	return crypto.createHmac('sha256', 'secret12341234')
	.update(rowPassword)
	.digest('hex');
}

module.exports = {
	save: async function(params) {
		try {
			params.password = encode(params.password);

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
			params.password =  encode(params.password);

			const loginUser = await User.findOneByServiceNumber(params.serviceNumber);

			if(loginUser === null) {
				return false;
			}
			
			if(loginUser.password !== params.password) {
				console.log(loginUser.password);
				console.log(params.password);
				return false;
			}

			return true;
		} catch(err) { throw err; }
	}
};