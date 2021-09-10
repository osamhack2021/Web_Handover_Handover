const maria = require('mysql')

const conn = maria.createConnection({
    host: '172.22.0.4',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'test'
});

module.exports = conn; 