const mongoose = require('mongoose');
const Types = mongoose.Schema.Types

const groupSchema = mongoose.Schema({
    name: { type: String, required: true },

    // ,{ObjectId},{ObjectId},...
    path: {
        type: String,
        validate: {
            validator: function(v) {
                return /^,(.+?,){1,}$/.test(v);
            },
            message: props => `${props.value} is not a valid path!`
        }
    },
    admins: {
        type: [{ type: Types.ObjectId, ref: 'User', populate: true }],
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: props => `admins.length should be bigger than 0!`
        }
    },
    inspectors: [{ type: Types.ObjectId, ref: 'User', populate: true }]
}, {
    versionKey: false
});

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

groupSchema.pre('save', function(next) {
    this.admins = distinctObjectIdArray(this.admins);

    // Path
    if(!this.path) {
        this.path = `,${this._id},`;
    } else {
        this.path = this.path + this._id + ',';
    }

    next();
});
groupSchema.pre('updateOne', function(next) {
    const data = this.getUpdate();

    data.admins = distinctObjectIdArray(data.admins);
    this.update({}, data);

    next();
});

groupSchema.statics.create = function(payload) {
    const group = new this(payload);

    return group.save();
};

groupSchema.statics.findByid = function(id) {
    return this.findOne({ id });
}

module.exports = mongoose.model('Group', groupSchema);