const userService = require('./userService.js')

const crypto = require('crypto');
const { RuntimeError } = require('./errors/RuntimeError.js');
const { AuthError, ForbiddenError } = require('./errors/BusinessError.js');

const jwt = require('jsonwebtoken');
const SECRET_KEY = "MY_SECRET_KEY";

function encode(rawPassword) {
	return crypto.createHmac('sha256', 'secret12341234')
	.update(rawPassword)
	.digest('hex');
}

function decodeToken(token) {
	const decoded = jwt.verify(token, SECRET_KEY)
					   .catch(err => {
						   throw new ForbiddenError(err.message)
						});

	return decoded;
}

module.exports = {

    login: async function(params) {
		
		params.password = encode(params.password);

		const loginUser = await userService
            .searchByServiceNumber(params.serviceNumber)
            .catch(err => {
                if(err instanceof TypeError) {
                    throw new AuthError("LOGIN fail");
                }
                throw new RuntimeError(err.message);
            });

		if(loginUser === null|| loginUser.password !== params.password) {
			throw new AuthError('LOGIN fail');
		}

		const token = jwt.sign({
			_id: loginUser._id,
			serviceNumber: loginUser.serviceNumber,
			status: loginUser.status,
		}, SECRET_KEY, {
			expiresIn: '1h'
		});

		return token;		
	},
  
	getLoginUser: function(token) {
		return decodeToken(token);
	},

	authAdmin: function(token) {
		const result = decodeToken;
		if(result.status !== 'admin') {
			throw new ForbiddenError('not have access');
		}
		return result;	
	}

}