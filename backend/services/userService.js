const User = require('../models/User.js');

const crypto = require('crypto');
const { RuntimeError } = require('./errors/RuntimeError.js');
const { BusinessError, AuthError } = require('./errors/BusinessError.js');

const jwt = require('jsonwebtoken');
const SECRET_KEY = "MY_SECRET_KEY";

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
					throw new BusinessError('serviceNumber overlap');
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

		const token = jwt.sign({
			serviceNumber: loginUser.serviceNumber
		}, SECRET_KEY, {
			expiresIn: '1h'
		});

		return token;		
	},

	update: async function(id ,params) {
		if(params.password) {
			params.password = encode(params.password);
		}

		const result = await User
			.updateByid(id, params)
			.catch(err => {
				throw new RuntimeError(err.message);
			});

		result._id = '';
		result.password = '';
	
		return result;
	},

	delete: async function(params) {
		
		const result = await User
			.deleteByid(params.id)
			.catch(err => {
				throw new RuntimeError(err.message);
			});

		return true;
	}
};