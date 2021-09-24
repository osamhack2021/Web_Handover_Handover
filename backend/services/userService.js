const User = require('../models/User.js');

const crypto = require('crypto');
const { RuntimeError, InvalidParameterError, DocumentNotFounndError, NotFoundError } = require('./errors/RuntimeError.js');
const { BussinessError, AuthError } = require('./errors/BussinessError.js');

function encode(rowPassword) {
	return crypto.createHmac('sha256', 'secret12341234')
	.update(rowPassword)
	.digest('hex');
}

module.exports = {
	search: async function(query) {
		try {
			let result = await User.findAll(query);
			
			if(result.length === 0) throw new NotFoundError('Not Found: 검색 결과가 없습니다.');

			return result;
		} catch(err) { throw err; }
	},

	save: async function(params) {
		params.password = encode(params.password);

		let result = await User
			.create(params)
			.catch(err => {
				throw new RuntimeError(err.message);
			});

		result._id = '';
		result.password = '';

		return result;
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

		return loginUser;
	}
};