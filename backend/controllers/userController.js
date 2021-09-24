const userService = require('../services/userService.js');

const jwt = require('jsonwebtoken');
const SECRET_KEY = "MY_SECRET_KEY";

module.exports = {

    // GET (Test 완료)
    search: async function(req, res) {

        // 활성화 상태의 유저만 조회
        let query = Object.assign(req.query, { status: 'avail' });
        let projection = {
            name: true, rank: true, title: true,
            group: true, email: true, tel: true
        };

        try {
            const result = await userService.search(query, projection);
            res.status(200).send(result);
        } catch(err) {
            res.status(err.status).send(err.message);
        }
    },

    // POST (Group 생성 쿼리 생성 이후 테스트 예정)
    save: async function(req, res) {
        try {
            const result = await userService.save(req.body);
            res.status(201).send(result);   // 201 Created
        } catch(err) {
            res.status(err.status).send(err.message);
        }
    },

    

    // POST (Test 완료)
    login: async function(req, res) {
        try {
            const result = await userService.auth(req.body);

            const token = jwt.sign({
                serviceNumber: result.serviceNumber
            }, SECRET_KEY, {
                expiresIn: '1h'
            });

            res.cookie('jwt', token);

            res.status(201).send({
                result: 'OK',
                token
            });

        } catch(err) {
            console.log(err);
            res.status(err.status).send(err.message);
        }
    }
};