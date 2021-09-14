var mongoose = require('mongoose');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
    console.log('connected to mongod server');
})

module.exports = () => {
    mongoose.connect('mongodb://172.18.0.2:27017/Handover', function (err) {
        if(err) {
           console.log('mongodb connection err');
           console.log(err)
       }
    });
    // require('./models/User.js');
};