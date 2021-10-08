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

function isSelf(loginUserId, targetUserId) {
	return loginUserId === targetUserId;
}

async function isAdmin(loginUserId) {
	const user = await userService.findOne({_id:loginUserId}, {status:true})
			.catch(err => {throw err});
	return user.status === 'admin';
}

async function isHumanResourceManager(loginUserId, targetUserId) {
	const user = await userService.findOne({_id:targetUserId}, {group:true})
			.catch(err => {throw err});

	return await isGroupManager(loginUserId, user.group)
		.catch(err => {throw err});
}

async function isGroupManager(loginUserId, targetGroupId) {
	const targetGroup = await groupService.read({_id: targetGroupId}, {admins: true})
			.catch(err => {
					throw err;
				});

	if(!targetGroup) {
		return false;
	}

	return "admins" in targetGroup ? targetGroup.admins.includes(loginUserId) : false;
}

async function isItemEditor(loginUserId, targetItemId) {
	const user =  await userService.findOne({_id:loginUserId}, {group:true})
			.catch(err => {throw err});
	const targetItem = await itemService.read({_id: targetItemId}, {owner: true, contributors: true, accessGroups: true})
			.catch(err => {throw err});

	if(!targetItem) {
		return false;
	}

	const isOwner = 'owner' in targetItem ? targetItem.owner._id === loginUserId : false,
		isContributor = 'contributors' in targetItem ? targetItem.contributors.includes(loginUserId) : false,
		isEditAccessGroup = 'accessGroups' in targetItem ?
				 		('edit' in targetItem.accessGroups ? 
				 		accessGroups.edit.includes(user.group) : false) : false;

	return isOwner || isContributor || isEditAccessGroup;
}

async function isItemReader(loginUserId, targetItemId) {
	const user = await userService.findOne({_id:loginUserId}, {group:true})
			.catch(err => {throw err});
	const targetItem = await itemService.read({_id: targetItemId}, { contributors: true, accessGroups: true})
			.catch(err => {throw err});
			
	if(!targetItem) {
		return false;
	}

	const isContributor = 'contributors' in targetItem ? targetItem.contributors.includes(loginUserId) : false,
		isEditAccessGroup = 'accessGroups' in targetItem ?
				 		('edit' in targetItem.accessGroups ? 
				 		accessGroups.edit.includes(user.group) : false) : false,
		isReadAccessGroup = 'accessGroups' in targetItem ?
				 		('read' in targetItem.accessGroups ? 
				 		accessGroups.read.includes(user.group) : false) : false;

		return isContributor || isEditAccessGroup || isReadAccessGroup;
}

module.exports = {

    login: async function(params) {
		
		params.password = encode(params.password);

		const loginUser = await userService
            .findOne({serviceNumber:params.serviceNumber},
				 {_id:true, serviceNumber: true, password:true, group:true, status: true})
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
			group: loginUser.group,
			status: loginUser.status
		}, SECRET_KEY, {
			expiresIn: '1h'
		});

		return token;		
	},
  
	getLoginUser: function(token) {
		return decodeToken(token);
	},

	authAdmin: async function(token) {
		const decode = decodeToken(token);

		const isAd = await isAdmin(decode._id).catch(err => {throw err});
		if(!isAd) {
			throw new ForbiddenError('not have access');
		}
		return isAd;	
	},
	//User 수정 권한 확인
	editUserAuth: async function(loginUserId, targetUserId) {

		const results = await Promise.all([isHumanResourceManager(loginUserId, targetUserId), isAdmin(loginUserId)])
				.catch(err =>{throw err});
	
		if(!isSelf(loginUserId, targetUserId) &&
			!results.includes(true)) {
			throw new ForbiddenError('not have access');
		}

		return true;
	},

	deleteUserAuth: async function(loginUserId, targetUserId) {
		
		const results = await Promise.all([isHumanResourceManager(loginUserId, targetUserId), isAdmin(loginUserId)])
				.catch(err =>{throw err});
	
		if(!results.includes(true)) {
			throw new ForbiddenError('not have access');
		}

		return true;
	},

	readUserAuth: async function(loginUserId, targetUserId) {
		const results = await Promise.all([isHumanResourceManager(loginUserId, targetUserId), isAdmin(loginUserId)])
				.catch(err =>{throw err});
	
		if(!isSelf(loginUserId, targetUserId) &&
			!results.includes(true)) {
				return 'general';
		}
		
		return 'all';
	},

	//Group 수정 권한 확인
	editGroupAuth: async function(loginUserId, targetGroupId) {
		const results = await Promise.all([isGroupManager(loginUserId, targetGroupId), isAdmin(loginUserId)])
				.catch(err =>{throw err});
		if(!results.includes(true)){
			throw new ForbiddenError('not have access');
		}

		return true;
	},

	//Item 수정 권한 확인
	editItemAuth: async function(loginUserId, targetItemId) {
		const results = await Promise.all([isItemEditor(loginUserId, targetItemId), isAdmin(loginUserId)])
				.catch(err =>{throw err});
		if(!results.includes(true)){
			throw new ForbiddenError('not have access');
		}

		return true;
	},

	readItemAuth: async function(loginUserId, targetItemId) {
		const results = await Promise.all([isItemReader(loginUserId, targetItemId), isAdmin(loginUserId)])
					.catch(err =>{throw err});
		if(!results){
			throw new ForbiddenError('not have access');
		}

		return true;
	},

}