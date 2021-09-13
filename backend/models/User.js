const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    id: { type: String, unique: 1 },
    password: { type: String, minLength: 5, },
    name: { type: String, maxLength: 50 },
    email: { type: String, trim: true },
    role: { type: Number, default: 0 },
    serviceStart: { type: Date }
});


userSchema.statics.create = function(payload) {
    const user = new this(payload);

    // return Promise
    return user.save();
};

userSchema.statics.findAll = function() {
    return this.find({});
};

userSchema.statics.findOneByUserid = function(id) {
    return this.findOne({ id });
};

userSchema.statics.updateByUserid = function(id, payload) {
    return this.findOneAndUpdate({ id }, payload, { new: true });
};

userSchema.statics.deleteByUserid = function(id) {
    return this.remove({ id });
};

module.exports = mongoose.model('User', userSchema);