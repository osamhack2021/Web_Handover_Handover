const User = require('../models/User.js');

const crypto = require('crypto');
const { RuntimeError } = require('./errors/RuntimeError.js');
const { BussinessError, AuthError } = require('./errors/BusinessError.js');

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
		
	},

	update: async function(params) {
		if(params.password) {
			params.password = encode(params.password);
		}

		const result = await User
			.updateByid(params._id, params)
			.catch(err => {
				throw new RuntimeError(err.message);
			});

		result._id = '';
		result.password = '';
	
		return result;
	},

	delete: async function(params) {
		
		const result = await User
			.deleteByid(params._id)
			.catch(err => {
				throw new RuntimeError(err.message);
			});

		return true;
	}
};