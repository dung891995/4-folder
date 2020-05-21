var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/k4', {useNewUrlParser: true,useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("ket noi thanh cong");
});
module.exports= mongoose;