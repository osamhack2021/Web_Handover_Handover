const userService = require('./userService.js');
const groupService = require('./groupService.js');
const itemService = require('./itemService.js');

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
	try{
		const decoded = jwt.verify(token, SECRET_KEY);
		
		return decoded;
	}catch(err) {
		throw new ForbiddenError(err.message);
	}	
}

function isSelf(loginUser, targetUser) {
	return loginUser === targetUser;
}

async function isAdmin(loginUser) {
	const user = await userService.searchById(loginUser)
			.catch(err => {throw err});
	return user.status === 'admin';
}

async function isHRManager(loginUser, targetUser) {
	const tu = await userService.searchById(targetUser)
			.catch(err => {throw err});
	const targetGroup = await groupService.read({_id: tu.group}, {admins: true})
			.catch(err => {throw err});

	return targetGroup.admins.includes(loginUser);
}

async function isGroupManager(loginUser, targetGroup) {
	const tg = await groupService.read({_id: targetGroup}, {admins: true})
			.catch(err => {throw err});

	return tg.admins.includes(loginUser);		
}

async function isItemEditer(loginUser, targetItem) {
	const user = await userService.searchById(loginUser)
			.catch(err => {throw err});
	const ti = await itemService.read({_id: targetItem}, {owner: true, contributors: true, accessGroups: true})
			.catch(err => {throw err});

	return (ti.owner._id === loginUser ||
			ti.contributors.includes(user)||
			accessGroups.edit.includes(user.group));		
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
		}, SECRET_KEY, {
			expiresIn: '1h'
		});

		return token;		
	},
  
	getLoginUser: function(token) {
		return decodeToken(token);
	},

	authAdmin: async function(token) {
		const result = decodeToken(token);

		const isAd = await isAdmin(result._id).catch(err => {throw err});
		if(!isAd) {
			throw new ForbiddenError('not have access');
		}
		return isAd;	
	},

	userEditAuth: async function(loginUser, targetUser) {
		const isHRM = await isHRManager(loginUser, targetUser).catch(err => {throw err});
		const isAd = await isAdmin(loginUser).catch(err => {throw err});
		
		if(!isSelf(loginUser, targetUser) &&
		   !isAd && !isHRM){
			throw new ForbiddenError('not have access');
		}

		return true;
	},

	groupEditAuth: async function(loginUser, targetGroup) {
		const isGM = await isGroupManager(loginUser, targetGroup).catch(err => {throw err});
		const isAd = await isAdmin(loginUser).catch(err => {throw err});

		if(!isAd && !isGM){
			throw new ForbiddenError('not have access');
		}

		return true;
	},

	itemEditAuth: async function(loginUser, targetItem) {
		const isIE = await isItemEditer(loginUser, targetItem).catch(err => {throw err});
		const isAd = await isAdmin(loginUser).catch(err => {throw err});

		if(!isAd && !isIE){
			throw new ForbiddenError('not have access');
		}

		return true;
	}

}