const mongoose = require('mongoose');
const Types = mongoose.Schema.Types

const itemSchema = mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true, enum: [ 'cabinet', 'document', 'card' ] },
    owner: { type: Types.ObjectId, ref: 'User', required: true },
    path: { type: String, required: true },
    content: { type: String },
    tags: [{ type: String }],
    contributor: [{ type: Types.ObjectId, ref: 'User' }],
    accessGroups: {
        read: [{ type: Types.ObjectId, ref: 'Group' }],
        edit: [{ type: Types.ObjectId, ref: 'Group' }]
    },
    history: [{ type: Types.ObjectId, ref: 'Item' }],
    status: { type: String, enum: [ 'draft', 'archived', 'published', 'deleted', 'modified' ], required: true },
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

itemSchema.statics.create = async function(payload) {

    const item = new this(payload);

    // Path, Status unique check
    let items = await this.find({
        path: payload.path,
        status: {
            $not: {
                $regex: new RegExp('deleted|modified')
            }
        }
    });
  
    if(items.length > 0) {
        throw new mongoose.Error('MongoError: Item already exists');
    }

    return item.save();
};

module.exports = mongoose.model('Item', itemSchema);