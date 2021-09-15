const mongoose = require('mongoose');
const Types = mongoose.Schema.Types

const groupSchema = mongoose.Schema({

    // 그룹명
    name: { type: String },
    // 그룹 경로
    path: { type: String },
    // 그룹 관리자들
    admins: [{ type: Types.ObjectId, ref: 'User' }],
    // 그룹 보안성 검수자들
    inspectors: [{ type: Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Group', groupSchema);