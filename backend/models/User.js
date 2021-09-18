const mongoose = require('mongoose');
const Types = mongoose.Schema.Types

const userSchema = mongoose.Schema({

    // 군번
    serviceNumber: { type: String, unique: 1 },
    // 비밀번호
    password: { type: String },
    // 이름
    name: { type: String },
    // 계급
    rank: { type: String },
    // 직위
    title: { type: String },
    // 부서
    groups: [{ type: Types.ObjectId, ref: 'Group' }],
    email: { type: String },
    tel: { type: String },
    // 최종 접속 일시
    lastLogin: { type: Date },
    // 계정 생성 일시
    firstLogin: { type: Date },
    // 북마크
    bookmarks: [{ type: Types.ObjectId, ref: 'Item' }],
    // 구독
    subscriptions: {
        users: [{ type: Types.ObjectId, ref: 'User' }],
        groups: [{ type: Types.ObjectId, ref: 'Group' }]
    }
});


userSchema.statics.create = function(payload) {
    const user = new this(payload);

    // return Promise
    return user.save();
};

userSchema.statics.findAll = function() {
    return this.find({});
}

userSchema.statics.findOneByid = function(id) {
    return this.findOne({ id });
};

userSchema.statics.updateByid = function(id, payload) {
    return this.findOneAndUpdate({ id }, payload, { new: true });
};

userSchema.statics.deleteByid = function(id) {
    return this.remove({ id });
};

module.exports = mongoose.model('User', userSchema);