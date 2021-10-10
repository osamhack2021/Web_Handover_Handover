const crypto = require('crypto');
const User = require('../models/User.js');

const { RuntimeError } = require('./errors/RuntimeError.js');
const { BusinessError, NotFoundError } = require('./errors/BusinessError.js');

function encode(rowPassword) {
  return crypto.createHmac('sha256', 'secret12341234')
    .update(rowPassword)
    .digest('hex');
}

module.exports = {

	find: async function(params, projection = {}) {

		const result = await User
			.find(params, projection)
			.catch(err => {
				throw new RuntimeError(params + '를 불러올 수 없습니다.');
			});

		if(result === null) throw new NotFoundError('Not Found: 검색 결과가 없습니다.');

		return result;
	},

	findOne: async function(params, projection = {}) {

		const result = await User
			.findOne(params, projection)
			.catch(err => {
				throw new RuntimeError(params + '를 불러올 수 없습니다.');
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
					throw new BusinessError('군번이 이미 존재합니다');
				} 
				throw new RuntimeError(err.message);		
			});

		result.password = '';

		return result;
	},

	update: async function(id ,params) {
		if(params.password) {
			params.password = encode(params.password);
		}
		const result = await User
			.findOneAndUpdate({_id:id}, params, {new: true})
			.catch(err => {
				throw new RuntimeError("update를 진행할 수 없습니다.");
			});
		result.password = '';
	
		return result;
	},

	delete: async function(id) {
		
		const result = await User
			.deleteOne({_id:id})
			.catch(err => {
				throw new RuntimeError("delete를 진행할 수 없습니다.");
			});

		return true;
	},

	checkExist: async function(params) {
		
		const user = await User
		.findOne({serviceNumber:params.serviceNumber})
		.catch(err => {	throw new RuntimeError(err.message); });
	
		return {exist: user !== null};
	}

};
