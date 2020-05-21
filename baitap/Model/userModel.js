var mongoose = require("../config/dbConnect")
var Schema= mongoose.Schema;
var userSchema = new Schema({
    email: String,
    password: String,
    role: {
        type: String,
        default: 'user'
      }
},{
    collection:"account"
})
var UserModel = mongoose.model("account",userSchema);
// UserModel.create({
//     email: "admin",
//     password: 1
// }).then((result) => {
//     console.log(result);
// })
module.exports = UserModel