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
				throw new RuntimeError("Runtime error: " + params + '를 불러올 수 없습니다.');
			});

		if(result === null) throw new NotFoundError('User not found: 존재하지 않는 사용자입니다.');

		return result;
	},

	findOne: async function(params, projection = {}) {

		const result = await User
			.findOne(params, projection)
			.catch(err => {
				throw new RuntimeError("Runtime error: " + params + '를 불러올 수 없습니다.');
			});

		if(result === null) throw new NotFoundError('User not found: 존재하지 않는 사용자입니다.');

		return result;
	},

	save: async function(params) {

		params.password = encode(params.password);

		let result = await User
			.create(params)
			.catch(err => {
				if(err.code === 11000) {
					throw new BusinessError('Duplicate found: 이미 가입된 군번입니다.');
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
				throw new RuntimeError("Runtime error: 사용자 정보 수정에 오류가 발생했습니다.");
			});
		result.password = '';
	
		return result;
	},

	delete: async function(id) {
		
		const result = await User
			.deleteOne({_id:id})
			.catch(err => {
				throw new RuntimeError("Runtime error: 사용자 삭제에 오류가 발생했습니다.");
			});

		return true;
	},

	checkExist: async function(params) {
		
		const user = await User
		.findOne({serviceNumber:params.serviceNumber})
		.catch(err => {	
			throw new RuntimeError("Runtime error: 알수없는 오류가 발생했습니다."); 
		});
	
		return {exist: user !== null};
	}

};
