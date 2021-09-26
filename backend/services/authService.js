const userService = require('./userService.js')

const crypto = require('crypto');
const { RuntimeError } = require('./errors/RuntimeError.js');
const { AuthError, ForbiddenError } = require('./errors/BusinessError.js');

const jwt = require('jsonwebtoken');
const SECRET_KEY = "MY_SECRET_KEY";

function encode(rowPassword) {
	return crypto.createHmac('sha256', 'secret12341234')
	.update(rowPassword)
	.digest('hex');
}

function decodeToken(token) {
	const decoded = jwt.verify(token, SECRET_KEY);

	if(!decoded) {
		throw new ForbiddenError('unauthorized');
	}

	return decoded;
}

module.exports = {

    login: async function(params) {
		
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
			serviceNumber: loginUser.serviceNumber,
			
		}, SECRET_KEY, {
			expiresIn: '1h'
		});

		return token;		
	},

	isAdmin: async function(token) {
		//const clientToken = req.cookies.jwt;
        const decoded = decodeToken(token);

		if(decoded.status === 'admin'){
			return true;
		}

		return false;
	},

	isSelf: async function(token, serviceNumber) {
        const decoded = decodeToken(token);

		if(decoded.serviceNumber === serviceNumber){
			return true;
		}
		
		return false;
	}

}