const mongoose = require('mongoose');
const Types = mongoose.Schema.Types

const itemSchema = mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true, enum: [ 'cabinet', 'document', 'card' ] },
    owner: { type: Types.ObjectId, ref: 'User', required: true },
    path: {
        type: String,
        validate: {
            validator: function(v) {
                return /^,(.+?,){1,}$/.test(v);
            },
            message: props => `${props.value} is not a valid path!`
        },
        required: true
    },
    content: { type: String },
    tags: [{ type: String }],
    contributors: [{ type: Types.ObjectId, ref: 'User' }],
    accessGroups: {
        read: [{ type: Types.ObjectId, ref: 'Group' }],
        edit: [{ type: Types.ObjectId, ref: 'Group' }]
    },
    history: [{ type: Types.ObjectId, ref: 'Item' }],
    status: {
        type: String,
        enum: [ 'draft', 'archived', 'published', 'deleted', 'modified' ],
        required: true
    },
    inspection: {
        result: { type: String, enum: [ 'approve', 'deny' ] },
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
    },
    created: { type: Date }
}, { versionKey: false });


function distinctObjectIdArray(arr) {

    /* Removing duplicate values */

    // ["61507eaab51b4983b5fb8f1a", "61507eaab51b4983b5fb8f1a"]
    let uniqueArr = arr.map(item => item.toString());

    // ["61507eaab51b4983b5fb8f1a"]
    uniqueArr = [...new Set(uniqueArr)];

    // [ new ObjectId("61507eaab51b4983b5fb8f1a") ]
    uniqueArr = uniqueArr.map(item => mongoose.Types.ObjectId(item));

    return uniqueArr;
}

itemSchema.pre('save', function(next) {
    this.tags = distinctObjectIdArray(this.tags);
    this.contributors = distinctObjectIdArray(this.contributors);
    this.accessGroups.read = distinctObjectIdArray(this.accessGroups.read);
    this.accessGroups.edit = distinctObjectIdArray(this.accessGroups.edit);
    this.history = distinctObjectIdArray(this.history);

    next();
});
itemSchema.pre('updateOne', function(next) {
    const data = this.getUpdate();

    data.tags = distinctObjectIdArray(data.tags);
    data.contributors = distinctObjectIdArray(data.contributors);
    data.accessGroups.read = distinctObjectIdArray(data.accessGroups.read);
    data.accessGroups.edit = distinctObjectIdArray(data.accessGroups.edit);
    data.history = distinctObjectIdArray(data.history);
    this.update({}, data);

    next();
});

itemSchema.statics.create = async function(payload) {
    const item = new this(payload);

    return item.save();
};

module.exports = mongoose.model('Item', itemSchema);