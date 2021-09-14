const mongoose = require('mongoose');
const Types = mongoose.Schema.Types

const itemSchema = mongoose.Schema({

    // 제목
    title: { type: String },
    // 종류 ["cabinet", "document", "card"]
    type: { type: String },
    // 내용 (raw HTML) need to Encrypt
    content: { type: Object },
    // 태그들
    tags: [{ type: Types.ObjectId, ref: 'Tag' }],
    // 소유자
    owner: { type: Types.ObjectId, ref: 'User' },
    // 기여자들
    contributor: [{ type: Types.ObjectId, ref: 'User' }],
    // 접근 권한
    accessGroups: {
        read: [{ type: Types.ObjectId, ref: 'Group' }],
        edit: [{ type: Types.ObjectId, ref: 'Group' }]
    },
    // 수정 기록 (항목 수정시에 새로운 Item객체를 만들고 추가)
    history: [{ type: Types.ObjectId, ref: 'Item' }],
    // 문서 상태 { draft: 임시저장, archived: 보관, published: 게시 }
    status: { type: String },

    // 보안 검수 결과
    inspection: {
        // approve: 통과, deny: 거절
        result: { type: String },
        by: { type: Types.ObjectId, ref: 'User' },
        date: { type: Date }
    },

    // 댓글
    comments: []
});

module.exports = mongoose.model('Item', itemSchema);