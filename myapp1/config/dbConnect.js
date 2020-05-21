require('dotenv').config({ path: '../env/.env' })
var mongoose = require('mongoose');
function dbConnect() {
    var URL = process.env.DB + '://' + process.env.DB_HOST + '/' + process.env.DB_NAME
     mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
     return mongoose;
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('thanh cong');
})
module.exports = dbConnect;