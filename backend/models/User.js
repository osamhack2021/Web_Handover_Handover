const mongoose = require('mongoose');
const Types = mongoose.Schema.Types

const userSchema = mongoose.Schema({
    serviceNumber: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    rank: { type: String, required: true },
    title: { type: String, required: true },

    status: { type: String, default: 'active', enum: ['admin','active', 'inactive', 'retired', 'deleted'] },
    group: { type: Types.ObjectId, ref: 'Group'},

    email: { type: String },
    tel: { 
        military: { type: String },
        mobile: { type: String }
    },
    lastLogin: { type: Date },
    firstLogin: { type: Date },
    bookmarks: [{ type: Types.ObjectId, ref: 'Item' }],
    subscriptions: {
        users: [{ type: Types.ObjectId, ref: 'User' }],
        groups: [{ type: Types.ObjectId, ref: 'Group' }]
    }
},{
    versionKey: false
});


userSchema.statics.create = function(payload) {
    const user = new this(payload);

    // return Promise
    return user.save();
};

module.exports = mongoose.model('User', userSchema);