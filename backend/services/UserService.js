const userSchema = require('../models/User.js');

async function save(params){
	var result;
	await userSchema.create(params).then(rs => result = rs.id);
	return result;
}

async function findAll() {
	var result;
	await userSchema.findAll().then(rs => result = rs);
	return result;
}

async function findById(id) {
	var result;
	await userSchema.findById(id).then(rs => result = rs);
	return result;
}


module.exports.findAll = findAll;
module.exports.findById = findById;
module.exports.save = save;