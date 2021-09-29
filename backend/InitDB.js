const mongoose = require('mongoose');

const User = require('./models/User.js');
const Group = require('./models/Group.js');
const Item = require('./models/Item.js');

let users = [{
    serviceNumber: 'ntcho',
    password: 'ntcho',
    name: '조나단',
    rank: '병장',
    title: '팀장',
    status: 'active'
}, {
    serviceNumber: 'phjppo0918',
    password: 'phjppo0918',
    name: '박현준',
    rank: '상병',
    title: '백엔드 개발자',
    status: 'active'
}, {
    serviceNumber: '134130',
    password: '134130',
    name: '오지환',
    rank: '일병',
    title: '백엔드 노예',
    status: 'active'
}, {
    serviceNumber: 'ahnavocado',
    password: 'ahnavocado',
    name: '안수겸',
    rank: '상병',
    title: '디자이너',
    status: 'active'
}, {
    serviceNumber: 'cw00h',
    password: 'cw00h',
    name: '최우혁',
    rank: '일병',
    title: '프론트 개발자',
    status: 'active'
}, {
    serviceNumber: 'holymollyhao',
    password: 'holymollyhao',
    name: '김태원',
    rank: '일병',
    title: '프론트 개발자',
    status: 'active'
}];

let groups = [{
    name: 'handover',
    path: ',handover,',
}, {
    name: 'backend',
    path: ',handover,backend,',
}, {
    name: 'frontend',
    path: ',handover,frontend,',
}];

let items = [{
    title: 'Handover',
    type: 'cabinet',
    owner: mongoose.Types.ObjectId(),
    path: ',Handover,',
    content: 'Handover Cabinet',
    status: 'published'
}, {
    title: 'handover',
    type: 'document',
    owner: mongoose.Types.ObjectId(),
    path: ',Handover,handover,',
    content: 'handover document',
    status: 'published'
}, {
    title: 'backend',
    type: 'card',
    owner: mongoose.Types.ObjectId(),
    path: ',Handover,handover,backend,',
    content: 'backend card',
    status: 'published'
}, {
    title: 'frontend',
    type: 'card',
    owner: mongoose.Types.ObjectId(),
    path: ',Handover,handover,frontend,',
    content: 'frontend card',
    status: 'deleted'
}
];

const crypto = require('crypto');

function encode(rowPassword) {
	return crypto.createHmac('sha256', 'secret12341234')
	.update(rowPassword)
	.digest('hex');
}

async function init() {
    await Group.collection.drop();
    await User.collection.drop();
    await Item.collection.drop();

    await createGroups();
    await createUsers();
    await createItems();

    let ntcho = (await User.find({ serviceNumber: users[0].serviceNumber }))[0];
    await Group.updateOne(groups[0], { admins: [ mongoose.Types.ObjectId(ntcho._id) ] });
    await Item.updateOne(items[0], {
        owner: mongoose.Types.ObjectId(ntcho._id),
        accessGroups: {
            read: [mongoose.Types.ObjectId(ntcho.group)],
            edit: [mongoose.Types.ObjectId(ntcho.group)]
        }
    });
    await Item.updateOne(items[1], {
        owner: mongoose.Types.ObjectId(ntcho._id),
        accessGroups: {
            read: [mongoose.Types.ObjectId(ntcho.group)],
            edit: [mongoose.Types.ObjectId(ntcho.group)]
        }
    });

    let phjppo0918 = (await User.find({ serviceNumber: users[1].serviceNumber }))[0];
    await Group.updateOne(groups[1], { admins: [ mongoose.Types.ObjectId(phjppo0918._id) ] });
    await Item.updateOne(items[2], {
        owner: mongoose.Types.ObjectId(phjppo0918._id),
        accessGroups: {
            read: [mongoose.Types.ObjectId(phjppo0918.group)],
            edit: [mongoose.Types.ObjectId(phjppo0918.group)]
        }
    });

    let ahnavocado = (await User.find({ serviceNumber: users[3].serviceNumber }))[0];
    await Group.updateOne(groups[2], { admins: [ mongoose.Types.ObjectId(ahnavocado._id) ] });
    await Item.updateOne(items[3], {
        owner: mongoose.Types.ObjectId(ahnavocado._id),
        accessGroups: {
            read: [mongoose.Types.ObjectId(ahnavocado.group)],
            edit: [mongoose.Types.ObjectId(ahnavocado.group)]
        }
    });
}

async function createUsers() {
    let handoverId = (await Group.find({ name: 'handover' }))[0]._id;
    let backendId = (await Group.find({ name: 'backend' }))[0]._id;
    let frontendId = (await Group.find({ name: 'frontend' }))[0]._id;

    users[0].group = mongoose.Types.ObjectId(handoverId);
    users[1].group = mongoose.Types.ObjectId(backendId);
    users[2].group = mongoose.Types.ObjectId(backendId);
    users[3].group = mongoose.Types.ObjectId(frontendId);
    users[4].group = mongoose.Types.ObjectId(frontendId);
    users[5].group = mongoose.Types.ObjectId(frontendId);

    for(let user of users) {
        user.password = encode(user.serviceNumber);
        let user_ = new User(user);
        await user_.save();
    }
}

async function createGroups() {
    try {
        for(let group of groups) {
            let group_ = new Group(group);
            await group_.save();
        }
    } catch(e) {
        console.error(e);
    }
}



async function createItems() {
    try {
        for(let item of items) {
            let item_ = new Item(item);
            await item_.save();
        }
    } catch(e) {
        console.error(e);
    }
}

module.exports = { init };