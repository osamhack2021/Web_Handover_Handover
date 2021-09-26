const mongoose = require('mongoose');
const Types = mongoose.Schema.Types

const itemSchema = mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },     // 종류 ["cabinet", "document", "card"]
    owner: { type: Types.ObjectId, ref: 'User', required: true },
    path: { type: String, required: true, unique: true },
    content: { type: Object },
    tags: [{ type: Types.ObjectId, ref: 'Tag' }],
    contributor: [{ type: Types.ObjectId, ref: 'User' }],
    accessGroups: {
        read: [{ type: Types.ObjectId, ref: 'Group' }],
        edit: [{ type: Types.ObjectId, ref: 'Group' }]
    },
    history: [{ type: Types.ObjectId, ref: 'Item' }],
    status: { type: String },       // 문서 상태 { draft: 임시저장, archived: 보관, published: 게시 }
    inspection: {
        result: { type: String },   // approve: 통과, deny: 거절
        by: { type: Types.ObjectId, ref: 'User' },
        date: { type: Date }
    },
    comments: {
        type: [{
            content: { type: String, required: true },
            by: { type: Types.ObjectId, ref: 'User', required: true },
            date: { type: Date },
            isEdited: { type: Boolean, default: false }
        }]
    }
});

module.exports = mongoose.model('Item', itemSchema);