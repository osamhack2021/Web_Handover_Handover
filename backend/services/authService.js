const userService = require('./userService.js')

const crypto = require('crypto');
const { RuntimeError } = require('./errors/RuntimeError.js');
const { AuthError } = require('./errors/BusinessError.js');

const jwt = require('jsonwebtoken');
const SECRET_KEY = "MY_SECRET_KEY";

function encode(rawPassword) {
	return crypto.createHmac('sha256', 'secret12341234')
	.update(rawPassword)
	.digest('hex');
}

module.exports = {

    auth: async function(params) {
		params.password = encode(params.password);

		const loginUser = await userService
			.searchByServiceNumber(params.serviceNumber)
			.catch(err => {
				throw new RuntimeError(err.message);
			});

		if(loginUser === null|| loginUser.password !== params.password) {
			throw new AuthError('LOGIN fail');
		}

		const token = jwt.sign({
			_id: loginUser._id,
			serviceNumber: loginUser.serviceNumber
		}, SECRET_KEY, {
			expiresIn: '1h'
		});

		return token;		
	}
}