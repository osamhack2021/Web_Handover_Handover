const request = require('request');

const User = require('./models/User.js');
const Group = require('./models/Group.js');
const Item = require('./models/Item.js');

let jwt = '';

function post(url, body, type='POST') {
    console.log(url, type)
    return new Promise((resolve, reject) => {
        request({
            url: 'http://nginx/api' + url,
            method: type,
            body: body,
            json: true,
            headers: { 'Cookie': `jwt=${jwt};` }
        }, function(err, response, body) {
            if(err) reject(err);
            resolve(body);
        });
    });
}

async function dropCollections() {
    return Promise.all([
        User.collection.drop(),
        Group.collection.drop(),
        Item.collection.drop()
    ]);
}

async function init() {

    // Drop [User, Group, Item] Collections
    try {
        await dropCollections();
    } catch(e) {
        
    }

    let users = {};
    let groups = {};

    /****** Admin Start ******/

    // Create admin
    let admin = {
        serviceNumber: 'admin',
        password: 'admin',
        name: 'admin',
        rank: '대위',
        title: '관리자',
        status: 'admin',
        email: 'admin@osam.com',
        tel: {
            military: '0000',
            mobile: '010-0000-0000'
        },
        profileImageUrl: 'https://t1.daumcdn.net/liveboard/holapet/0e5f90af436e4c218343073164a5f657.JPG'
    };
    users.admin = await post('/user', admin);
    
    // login as admin
    jwt = (await post('/login', {
        serviceNumber: 'admin',
        password: 'admin'
    })).token;

    // Create group
    groups.osam = await post('/group', {
        name: 'OSAM',
        path: '',
        admins: [users.admin._id]
    });

    // Update admin's group
    users.admin = await post(`/user/${users.admin._id}`, {
        group: groups.osam._id
    }, 'PUT');
    /****** Admin End ******/

    /****** Create ntcho ******/
    let ntcho = {
        serviceNumber: 'ntcho',
        password: 'ntcho',
        name: 'ntcho',
        rank: '상병',
        title: '팀장',
        status: 'active',
        email: 'ntcho@github.com',
        tel: {
            military: '0000',
            mobile: '010-0000-0000'
        }
    };
    users.ntcho = await post('/user', ntcho);
    
    // login as ntcho
    jwt = (await post('/login', {
        serviceNumber: 'ntcho',
        password: 'ntcho'
    })).token;

    groups.handover = await post('/group', {
        name: 'Handover',
        path: groups.osam.path,
        admins: [users.ntcho._id]
    });

    /****** Create phjppo ******/
    let phjppo = {
        serviceNumber: 'phjppo',
        password: 'phjppo',
        name: 'phjppo',
        rank: '백엔드',
        title: '백엔드',
        status: 'active',
        email: 'phjppo@github.com',
        tel: {
            military: '0000',
            mobile: '010-0000-0000'
        }
    };
    users.phjppo = await post('/user', phjppo);
    
    // login as phjppo
    jwt = (await post('/login', {
        serviceNumber: 'phjppo',
        password: 'phjppo'
    })).token;

    groups.backend = await post('/group', {
        name: 'backend',
        path: groups.handover.path,
        admins: [users.phjppo._id]
    });

    /****** Create ahnavocado ******/
    let ahnavocado = {
        serviceNumber: 'ahnavocado',
        password: 'ahnavocado',
        name: 'ahnavocado',
        rank: '프론트',
        title: '프론트',
        status: 'active',
        email: 'ahnavocado@github.com',
        tel: {
            military: '0000',
            mobile: '010-0000-0000'
        }
    };
    users.ahnavocado = await post('/user', ahnavocado);
    
    // login as ahnavocado
    jwt = (await post('/login', {
        serviceNumber: 'ahnavocado',
        password: 'ahnavocado'
    })).token;

    groups.frontend = await post('/group', {
        name: 'frontend',
        path: groups.handover.path,
        admins: [users.ahnavocado._id]
    });

    /****** Create items ******/
    jwt = (await post('/login', {
        serviceNumber: 'admin',
        password: 'admin'
    })).token;

    let item1 = {
        title: 'OSAM Hackaton Guide',
        type: 'cabinet',
        owner: users.admin._id,
        path: '',
        content: 'OSAM Hackaton is contest for Korean Army in 2021',
        tags: ['OSAM', 'Hackaton'],
        accessGroups: {
            read: [groups.osam._id, groups.handover._id, groups.frontend._id, groups.backend._id],
            edit: [groups.osam._id]
        },
        status: 'published',
        comments: [{
            content: 'Wow! Very Good!!',
            by: users.ntcho._id,
            date: new Date('2021-9-10')
        }, {
            content: 'LGTM',
            by: users.ahnavocado._id,
            date: new Date('2021-9-16')
        }],
        created: new Date('2021-9-9')
    };

    let items = {};
    items.item1 = await post('/item', item1);

    await post(`/item/${items.item1._id}`, {
        content: `
<h2>2021 군장병 공개SW 온라인 해커톤</h2>
<blockquote>
  <p>초보도 괜찮아요, 든든한 멘토님들이 있거든요</p>
</blockquote>
<p>함께 개발하고 참여,공유하는 공개SW 개발 방식으로 온라인 해커톤이 진행됩니다.</p>
<br>
<p>국방 분야에 활용 가능한 참신하고 우수한 아이디어를 발굴하고,</p>
<br>
<p>SW인재 발굴을 위함이니 군장병 분들의 많은 관심과 참여 바랍니다.</p>
`
    }, 'PUT');

    let item2 = {
        title: 'OSAM Handover',
        type: 'cabinet',
        owner: users.ntcho._id,
        path: '',
        content: `
<h2>한 줄 요약</h2>
<p>군 인트라넷에서 사용할 수 있는 업무 내용 공유 서비스</p>
<h2>주요 기능</h2>
<h3>업무 문서 작성</h3>
<ul>
  <li>
    <p>여러가지 템플릿을 이용해 업무 내용을 설명하는 문서 작성</p>
  </li>
  <li>
    <p>여러가지 템플릿을 이용해 업무 내용을 설명하는 문서 작성</p>
  </li>
  <li>
    <p>기존 문서를 복사해서 내용을 개선한 문서를 작성 (Git 의 fork 개념과 유사)</p>
  </li>
</ul>
<h3>업무 문서 공유</h3>
<ul>
  <li>
    <p>부대 또는 부서 내 공통 업무를 설명하는 문서 공유</p>
  </li>
  <li>
    <p>같은 주특기를 가진 군 장병끼리 주특기 관련 문서 공유</p>
  </li>
</ul>
<h3>댓글, 북마크</h3>
<ul>
  <li>
    <p>문서에 관련된 질문 사항이나 개선을 건의할 수 있는 댓글 작성</p>
  </li>
  <li>
    <p>내 계정에 저장해놓았다가 나중에 다시 읽을 수 있도록 북마크 지원</p>
  </li>
</ul>
<h3>문서 출력</h3>
<ul>
  <li>
    <p>실제 업무간 편리하게 읽을 수 있게 문서로 출력</p>
  </li>
</ul>
`,
        tags: ['OSAM', 'Hackaton'],
        accessGroups: {
            read: [groups.osam._id, groups.handover._id, groups.frontend._id, groups.backend._id],
            edit: [groups.handover._id]
        },
        status: 'published',
        comments: [],
        created: new Date('2021-9-10')
    };

    items.item2 = await post('/item', item2);

    let item3 = {
        title: 'Backend',
        type: 'document',
        owner: users.phjppo._id,
        path: items.item2.path,
        content: `
<h2>Handover의 Backend팀을 소개합니다.</h2>
<p>phjppo / 박현준</p>
<br>
<p>134130 / 오지환</p>
`,
        tags: ['OSAM', 'Hackaton'],
        accessGroups: {
            read: [groups.osam._id, groups.handover._id, groups.frontend._id, groups.backend._id],
            edit: [groups.backend._id]
        },
        status: 'published',
        comments: [],
        created: new Date('2021-9-11')
    };

    items.item3 = await post('/item', item3);

    let item4 = {
        title: 'Backend API /user',
        type: 'card',
        owner: users.phjppo._id,
        path: items.item3.path,
        content: `
<h2>/user</h2>
<p><strong>Developer:</strong> phjppo / 박현준</p>
`,
        tags: ['OSAM', 'Hackaton'],
        accessGroups: {
            read: [groups.handover._id, groups.frontend._id, groups.backend._id],
            edit: [groups.backend._id]
        },
        status: 'published',
        comments: [],
        created: new Date('2021-9-12')
    };

    items.item4 = await post('/item', item4);

    let item5 = {
        title: 'Backend API /item',
        type: 'card',
        owner: users.phjppo._id,
        path: items.item3.path,
        content: `
<h2>/user</h2>
<p><strong>Developer:</strong> 134130 / 오지환</p>
`,
        tags: ['OSAM', 'Hackaton'],
        accessGroups: {
            read: [groups.handover._id, groups.frontend._id, groups.backend._id],
            edit: [groups.backend._id]
        },
        status: 'published',
        comments: [],
        created: new Date('2021-9-12')
    };

    items.item5 = await post('/item', item5);

    await post(`/user/${users.ntcho._id}`, {
        bookmarks: [items.item1._id, items.item2._id, items.item3._id, items.item4._id, items.item5._id],
        subscriptions: {
            users: [users.phjppo._id, users.ahnavocado._id],
            groups: [groups.handover._id, groups.frontend._id, groups.backend._id]
        }
    },'PUT');
}

module.exports = { init };