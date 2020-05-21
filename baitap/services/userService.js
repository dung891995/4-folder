var UserModel = require("../model/userModel");

function findAcc(email, password) {
    return UserModel.find({ email: email, password: password })
}
function register(email, password) {
    return UserModel.create({ email: email, password: password })
}
function findId(id) {
    return UserModel.find({ _id: id })
}
module.exports = {
    findAcc,
    register,
    findId
}