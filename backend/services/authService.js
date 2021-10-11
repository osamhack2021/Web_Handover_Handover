const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userService = require('./userService.js');
const groupService = require('./groupService.js');
const itemService = require('./itemService.js');

const { RuntimeError } = require('./errors/RuntimeError.js');
const { AuthError, ForbiddenError } = require('./errors/BusinessError.js');

const { JWT_SECRET_KEY } = process.env;
const { PASSWORD_HASH_KEY } = process.env;

function encode(rawPassword) {
  return crypto.createHmac('sha256', PASSWORD_HASH_KEY)
    .update(rawPassword)
    .digest('hex');
}

function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    return decoded;
  } catch (err) {
    throw new ForbiddenError('로그인이 필요한 서비스입니다.');
  }
}

function isSelf(loginUserId, targetUserId) {
  return loginUserId === targetUserId;
}

async function isAdmin(loginUserId) {
  const user = await userService.findOne({ _id: loginUserId }, { status: true })
    .catch((err) => { throw err; });
  return user.status === 'admin';
}

async function isHumanResourceManager(loginUserId, targetUserId) {
  const user = await userService.findOne({ _id: targetUserId }, { group: true })
    .catch((err) => { throw err; });
  const isGroupManager_ = await isGroupManager(loginUserId, user.group)
    .catch((err) => { throw err; });

  if (!isGroupManager_) {
    return false;
  }

  return targetGroup.admins.includes(loginUserId);
}

async function isGroupManager(loginUserId, targetGroupId) {
  const targetGroup = await groupService.read({ _id: targetGroupId }, { admins: true })
    .catch((err) => {
      throw err;
    });
  try {
    return targetGroup.admins.includes(loginUserId);
  } catch (err) {
    if (err instanceof TypeError) {
      return false;
    }
  }
}

async function isItemEditor(loginUserId, targetItemId) {
  const user = await userService.findOne({ _id: loginUserId }, { group: true })
    .catch((err) => { throw err; });
  const targetItem = await itemService.read({ _id: targetItemId }, { owner: true, contributors: true, accessGroups: true })
    .catch((err) => { throw err; });

  return targetItem.owner._id === loginUserId
			|| targetItem.contributors.includes(loginUserId)
			|| accessGroups.edit.includes(user.group);
}

async function isItemReader(loginUserId, targetItemId) {
  const user = await userService.findOne({ _id: loginUserId }, { group: true })
    .catch((err) => { throw err; });
  const targetItem = await itemService.read({ _id: targetItemId }, { contributors: true, accessGroups: true })
    .catch((err) => { throw err; });

  return targetItem.contributors.includes(loginUserId)
			|| accessGroups.edit.includes(user.group)
			|| accessGroups.read.includes(user.group);
}

module.exports = {

    login: async function(params) {
		
		params.password = encode(params.password);

		const loginUser = await userService
            .findOne({serviceNumber:params.serviceNumber})
            .catch(err => {
                if(err instanceof TypeError) {
                    throw new AuthError("로그인에 실패했습니다.");
                }
                throw new RuntimeError('로그인에 실패했습니다.');
            });

		if(loginUser === null|| loginUser.password !== params.password) {
			throw new AuthError('로그인에 실패했습니다.');
		}

		const user = jwt.sign({
			_id: loginUser._id,
			serviceNumber: loginUser.serviceNumber,
			group: loginUser.group,
			status: loginUser.status
		}, JWT_SECRET_KEY, {
			expiresIn: '1h'
		});

		return user;	
	},
  
	getLoginUser: function(token) {
		return decodeToken(token);
	},

	authAdmin: async function(token) {
		const decode = decodeToken(token);

		const isAd = await isAdmin(decode._id).catch(err => {throw err});
		if(!isAd) {
			throw new ForbiddenError('접근 권한이 존재하지 않습니다');
		}
		return isAd;	
	},
	//User 수정 권한 확인
	editUserAuth: async function(loginUserId, targetUserId) {

		const results = await Promise.all([isHumanResourceManager(loginUserId, targetUserId), isAdmin(loginUserId)])
				.catch(err =>{throw err});
	
		if(!isSelf(loginUserId, targetUserId) &&
			!results.includes(true)) {
			throw new ForbiddenError('접근 권한이 존재하지 않습니다');
		}

		return true;
	},

	deleteUserAuth: async function(loginUserId, targetUserId) {
		
		const results = await Promise.all([isHumanResourceManager(loginUserId, targetUserId), isAdmin(loginUserId)])
				.catch(err =>{throw err});
	
		if(!results.includes(true)) {
			throw new ForbiddenError('접근 권한이 존재하지 않습니다');
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
			throw new ForbiddenError('접근 권한이 존재하지 않습니다');
		}

		return true;
	},

	//Item 수정 권한 확인
	editItemAuth: async function(loginUserId, targetItemId) {
		const results = await Promise.all([isItemEditor(loginUserId, targetItemId), isAdmin(loginUserId)])
				.catch(err =>{throw err});
		if(!results.includes(true)){
			throw new ForbiddenError('접근 권한이 존재하지 않습니다');
		}

		return true;
	},

	readItemAuth: async function(loginUserId, targetItemId) {
		const results = await Promise.all([isItemReader(loginUserId, targetItemId), isAdmin(loginUserId)])
					.catch(err =>{throw err});
		if(!results){
			throw new ForbiddenError('접근 권한이 존재하지 않습니다');
		}

		return true;
	},

    const loginUser = await userService
      .findOne({ serviceNumber: params.serviceNumber })
      .catch((err) => {
        if (err instanceof TypeError) {
          throw new AuthError('로그인에 실패했습니다.');
        }
        throw new RuntimeError('로그인에 실패했습니다.');
      });

    if (loginUser === null || loginUser.password !== params.password) {
      throw new AuthError('로그인에 실패했습니다.');
    }

    const token = jwt.sign({
      _id: loginUser._id,
      serviceNumber: loginUser.serviceNumber,
      group: loginUser.group,
      status: loginUser.status,
    }, JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    return token;
  },

  getLoginUser(token) {
    return decodeToken(token);
  },

  async authAdmin(token) {
    const decode = decodeToken(token);

    const isAd = await isAdmin(decode._id).catch((err) => { throw err; });
    if (!isAd) {
      throw new ForbiddenError('접근 권한이 존재하지 않습니다');
    }
    return isAd;
  },
  // User 수정 권한 확인
  async editUserAuth(loginUserId, targetUserId) {
    const results = await Promise.all([isHumanResourceManager(loginUserId, targetUserId), isAdmin(loginUserId)])
      .catch((err) => { throw err; });

    if (!isSelf(loginUserId, targetUserId)
			&& !results.includes(true)) {
      throw new ForbiddenError('접근 권한이 존재하지 않습니다');
    }

    return true;
  },

  async deleteUserAuth(loginUserId, targetUserId) {
    const results = await Promise.all([isHumanResourceManager(loginUserId, targetUserId), isAdmin(loginUserId)])
      .catch((err) => { throw err; });

    if (!results.includes(true)) {
      throw new ForbiddenError('접근 권한이 존재하지 않습니다');
    }

    return true;
  },

  async readUserAuth(loginUserId, targetUserId) {
    const results = await Promise.all([isHumanResourceManager(loginUserId, targetUserId), isAdmin(loginUserId)])
      .catch((err) => { throw err; });

    if (!isSelf(loginUserId, targetUserId)
			&& !results.includes(true)) {
      return 'general';
    }

    return 'all';
  },

  // Group 수정 권한 확인
  async editGroupAuth(loginUserId, targetGroupId) {
    const results = await Promise.all([isGroupManager(loginUserId, targetGroupId), isAdmin(loginUserId)])
      .catch((err) => { throw err; });
    if (!results.includes(true)) {
      throw new ForbiddenError('접근 권한이 존재하지 않습니다');
    }

    return true;
  },

  // Item 수정 권한 확인
  async editItemAuth(loginUserId, targetItemId) {
    const results = await Promise.all([isItemEditor(loginUserId, targetItemId), isAdmin(loginUserId)])
      .catch((err) => { throw err; });
    if (!results.includes(true)) {
      throw new ForbiddenError('접근 권한이 존재하지 않습니다');
    }

    return true;
  },

  async readItemAuth(loginUserId, targetItemId) {
    const results = await Promise.all([isItemReader(loginUserId, targetItemId), isAdmin(loginUserId)])
      .catch((err) => { throw err; });
    if (!results) {
      throw new ForbiddenError('접근 권한이 존재하지 않습니다');
    }

    return true;
  },

};
