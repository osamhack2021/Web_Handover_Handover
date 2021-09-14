const mongoose = require('mongoose');
const Types = mongoose.Schema.Types

const tagSchema = mongoose.Schema({

    // 이름
    name: { type: String },
    // 설명
    description: { type: String }
});

module.exports = mongoose.model('Tag', tagSchema);