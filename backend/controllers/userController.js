const userService = require('../services/userService.js');
const authService = require('../services/authService.js');

const { BusinessError } = require('../services/errors/BusinessError.js');

module.exports = {

    search: async function(req, res) {

        const keys = Object.keys(req.query);
        const valids = ['group', 'name'];
            
         // Only allowed fields are Searchable
        for(let key of keys) {
            if(!valids.includes(key))
                throw new BusinessError(`${key} 는 검색할 수는 없는 속성입니다.`);
        }


        const projection = {
            _id: true, name: true, rank: true, status: true,
            group: true, email: true, tel: true, lastLogin: true
        };

        try {
            const result = await userService.find(req.query, projection);
            res.status(200).send(result);
        } catch(err) {
            res.status(err.status||500).send(err.message);
        }
    },

    searchDetail: async function(req, res) {

        let projection = {
            _id: true,serviceNumber:true, name: true, rank: true, title:true,
            status: true, group: true, email: true, tel: true, lastLogin: true,
            lastLogin: true, firseLogin:true, bookmarks: true, subscriptions: true
        };

        try {
            const auth = await authService.readUserAuth(res.locals._id.toString(), req.params.id);
            
            if(auth === 'general') {
                projection = {
                    _id: true, name: true, rank: true, status: true,
                    group: true, email: true, tel: true, lastLogin: true
                };
            }

            const result = await userService.findOne({_id: req.params.id}, projection);
            res.status(200).send(result);   // 201 Created
        } catch(err) {
            res.status(err.status||500).send(err.message);
        }
    },

    save: async function(req, res) {
        try {
            const result = await userService.save(req.body);
            res.status(201).send(result);   // 201 Created
        } catch(err) {
            res.status(err.status||500).send(err.message);
        }
    },

    updateUser: async function(req, res) {
        try {
            const keys = Object.keys(req.body);
            const valids = ['password', 'name','name','rank',
                    'title','status','group','email','tel', 
                    'lastLogin', 'firstLogin', 'bookmarks', 'subscriptions' ];
                
             // Only allowed fields are Searchable
            for(let key of keys) {
                if(!valids.includes(key))
                    throw new BusinessError(`${key} 는 User에 존재하지 않거나, 변경할 수 없는 속성입니다`);
            }

            await authService.editUserAuth(res.locals._id.toString(),req.params.id);

            const result = await userService.update(req.params.id,req.body);
            res.status(200).send(result);   
        } catch(err) {
            console.log(err);
            res.status(err.status||500).send(err.message);
        }
    },

    deleteUser: async function(req, res) {
        try {
            await authService.deleteUserAuth(res.locals._id.toString(),req.params.id);

            const result = await userService.delete(req.params.id);
            res.status(204).send();
        } catch(err) {
            res.status(err.status||500).send(err.message);
        }
    },

    isExist: async function(req, res) {
        try {
            const result = await userService.checkExist(req.body);
            console.log(result);
            res.status(200).send(result);
        } catch(err) {
            console.log(err);
            res.status(err.status||500).send(err.message);
        }
    }
};