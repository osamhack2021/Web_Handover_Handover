const mongoose = require('mongoose');
const Types = mongoose.Schema.Types

const groupSchema = mongoose.Schema({
    name: { type: String, required: true },
    path: { type: String, required: true, unique: true },
    admins: {
        type: [{ type: Types.ObjectId, ref: 'User' }],
        required: true
    },
    inspectors: [{ type: Types.ObjectId, ref: 'User' }]
}, {
    versionKey: false
});

groupSchema.statics.create = function(payload) {
    if(payload.admins.length > 1) {
        payload.admins = payload.admins.map(objectId => mongoose.Types.ObjectId(objectId));
    }

    const group = new this(payload);

    return group.save();
};

module.exports = mongoose.model('Group', groupSchema);