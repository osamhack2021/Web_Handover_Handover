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
});

module.exports = mongoose.model('Group', groupSchema);