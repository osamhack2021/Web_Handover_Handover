const { Types } = require('mongoose');

const User = require('./models/User.js');
const Group = require('./models/Group.js');
const Item = require('./models/Item.js');

const crypto = require('crypto');

function encode(rowPassword) {
	return crypto.createHmac('sha256', 'secret12341234')
	.update(rowPassword)
	.digest('hex');
}

async function init() {
    const USERS = [{
        serviceNumber: 'ntcho',
        password: 'ntcho',
        name: '조나단',
        rank: '병장',
        title: '팀장',
        status: 'admin',
    }, {
        serviceNumber: 'phjppo0918',
        password: 'phjppo0918',
        name: '박현준',
        rank: '상병',
        title: '백엔드 개발자',
        status: 'active',
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
    
    const GROUPS = [{
        name: 'handover',
        path: ',handover,',
        admins: 'ntcho',
        inspectors: []
    }, {
        name: 'backend',
        path: ',handover,backend,',
        admins: 'phjppo0918',
        inspectors: []
    }, {
        name: 'frontend',
        path: ',handover,frontend,',
        admins: 'cw00h',
        inspectors: []
    }, {
        name: 'design',
        path: ',handover,frontend,design,',
        admins: 'ahnavocado',
        inspectors: []
    }];
    
    const ITEMS = [{
        title: 'Handover',
        type: 'cabinet',
        owner: 'ntcho',
        path: ',Handover,',
        content: 'Handover Cabinet',
        tags: ['Handover'],
        accessGroups: {
            read: [],
            edit: []
        },
        status: 'published'
    }, {
        title: 'handover',
        type: 'document',
        owner: 'ntcho',
        path: ',Handover,handover,',
        content: 'handover document',
        tags: ['Handover'],
        accessGroups: {
            read: [],
            edit: []
        },
        status: 'published'
    }, {
        title: 'backend',
        type: 'card',
        owner: 'phjppo0918',
        path: ',Handover,handover,backend,',
        content: 'backend card',
        tags: ['Handover'],
        accessGroups: {
            read: [],
            edit: []
        },
        status: 'published'
    }, {
        title: 'frontend',
        type: 'card',
        owner: 'cw00h',
        path: ',Handover,handover,frontend,',
        content: 'frontend card',
        tags: ['Handover'],
        accessGroups: {
            read: [],
            edit: []
        },
        status: 'published'
    }];
    
    let Users = {};
    let Groups = {};
    let Items = {};

    try {

        // Reset DB
        await Promise.all([
            User.collection.drop(),
            Group.collection.drop(),
            Item.collection.drop()
        ]);
    } catch(e) {
        console.log(e);
    } finally {

        // Create Users
        for(let user of USERS) {
            user.password = encode(user.password);
            Users[user.serviceNumber] = await User.create(user);
        }

        // Create Groups
        for(let group of GROUPS) {
            group.admins = [Types.ObjectId(Users[group.admins]._id)];
            Groups[group.name] = await Group.create(group);
        }

        // Set Users group
        for(let name in Groups) {
            let admin = Groups[name].admins[0];
            Users[admin.serviceNumber] = await User.updateByid(admin, { group: Groups[name]._id });
        }

        // Create Items
        for(let item of ITEMS) {
            let user = Users[item.owner];

            user = await User.findOne({ _id: user._id });

            item.owner = Types.ObjectId(user._id);
            item.accessGroups = {
                read: [user.group],
                edit: [user.group]
            };
            Items[item.title] = await Item.create(item);
        }
    }
}

init();

module.exports = { init };