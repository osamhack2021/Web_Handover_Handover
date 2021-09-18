const User = require('../models/User.js');

module.exports = {
	save: async function(params) {
		try {
			let result = await User.create(params);
			return result.id;
		} catch(err) {
			if(err.code === 11000) throw 'Duplicated Key Error: "serviceNumber" is unique';
			throw err;
		}
	},
	
	findAll: async function() {
		var result;
		await User.findAll().then(rs => result = rs);
		return result;
	},
	
	findById: async function(id) {
		var result;
		await User.findById(id).then(rs => result = rs);
		return result;
	}
};