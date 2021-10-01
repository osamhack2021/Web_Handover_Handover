const User = require('../models/User.js');

const crypto = require('crypto');
const { RuntimeError } = require('./errors/RuntimeError.js');
const { BusinessError, AuthError } = require('./errors/BusinessError.js');

function encode(rowPassword) {
	return crypto.createHmac('sha256', 'secret12341234')
	.update(rowPassword)
	.digest('hex');
}

module.exports = {

	search: async function(query) {
		const result = await User
		.findAll(query)
		.catch(err => {
			throw new RuntimeError(err.message);
		});
			
		if(result.length === 0) throw new NotFoundError('Not Found: 검색 결과가 없습니다.');

		return result;

	},

	searchByServiceNumber: async function(serviceNumber) {
		const result = await User
		.findOneByServiceNumber(serviceNumber)
		.catch(err => {
			throw new RuntimeError(err.message);
		});

		if(result === null) throw new NotFoundError('Not Found: 검색 결과가 없습니다.');

		return result;
	},

	searchById: async function(id) {
		const result = await User
		.findOneByid(id)
		.catch(err => {
			throw new RuntimeError(err.message);
		});

		if(result === null) throw new NotFoundError('Not Found: 검색 결과가 없습니다.');

		return result;
	},

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