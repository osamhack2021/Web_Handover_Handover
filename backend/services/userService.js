const User = require('../models/User.js');

const crypto = require('crypto');
const AuthError = require('./errors/AuthError.js');
const RuntimeError = require('./errors/RuntimeError.js');
const BussinessError = require('./errors/BussinessError.js');

function encode(rowPassword) {
	return crypto.createHmac('sha256', 'secret12341234')
	.update(rowPassword)
	.digest('hex');
}

module.exports = {
	save: async function(params) {

		params.password = encode(params.password);

		let result = await User
			.create(params)
			.catch(err => {
				if(err.code === 11000) {
					throw new BussinessError('serviceNumber overlap');
				}
				throw new RuntimeError(err.message);
			});

		result._id = '';
		result.password = '';

		return result;
	},
	
	findAll: async function() {
		try {
			return await User.findAll();
		} catch(err) { throw err; }
	},

	auth: async function(params) {
		
		params.password = encode(params.password);

		const loginUser = await User
			.findOneByServiceNumber(params.serviceNumber)
			.catch(err => {
				throw new RuntimeError(err.message);
			});

		if(loginUser === null|| loginUser.password !== params.password) {
			throw new AuthError('LOGIN fail');
		}
		return true;
		
	}
};