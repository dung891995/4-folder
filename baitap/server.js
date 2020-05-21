var express = require("express");

var app = express();
var bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');

var userService = require("./services/userService");
var path = require('path')
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// parse application/json
app.use(bodyParser.json())
app.get("/login", function (req, res, next) {
    res.sendFile(path.join(__dirname, "./views/login.html"))
})
app.get("/home", function (req, res, next) {
    res.sendFile(path.join(__dirname, "./views/home.html"))
})
app.get("/register", function (req, res, next) {
    res.sendFile(path.join(__dirname, "./views/register.html"))
})
app.post("/register", function (req, res) {
    userService.register(req.body.email, req.body.password).then((result) => {
        res.json(result)
    })
})

// app.post("/login", function (req, res, next) {
//     userService.findByEmail(req.body.email).then(function (data) {
//         bcrypt.compare(req.body.password, data[0].password, function (err, result) {
//             if (result) {
//                 var token = jwt.sign({ id: data[0]._id }, "nodemy", { expiresIn: '3D' });
//                 res.cookie("token", token, { maxAge: 60 * 60 * 1000 * 24 })
//                 res.json({
//                     error: false,
//                     message: "dang nahp thanh cong"
//                 })
//             } else {
//                 res.json({
//                     error: true,
//                     message: "dang nahp khong thanh cong"
//                 })
//             }
//         })
//     })
// })
app.get("/admin", function (req, res, next) {
    var token = req.headers.authorization.split(" ")[1]
    try {
        var deCode = jwt.verify(token, "dung891995");
        userService.findId(deCode.id).then(function (data) {
            if (data.length >= 1) {
                next();
            }
            else {
                return res.json({
                    error: true,
                    message: "ban can đăng nhập"
                })
            }
        })
    } catch (error) {
        if (error.message) {
            return res.json({
                error: true,
                message: "ban can đăng nhập"
            })
        }
    }
},
    function (req, res, next) {
        res.json("chúc mừng đến với admin")
    })
app.post("/login", function (req, res) {
    userService.findAcc(req.body.email, req.body.password).then((result) => {
        if (result) {
            var token = jwt.sign({ id: result[0]._id }, "nodemy", { expiresIn: '3D' });
            res.cookie("token", token, { maxAge: 60 * 60 * 1000 * 24 })
            res.json({
                error: false,
                message: "dang nahp thanh cong"
            })
        } else {
            res.json({
                error: true,
                message: "dang nahp khong thanh cong"
            })
        }
    })
})


app.get("/cookie", function (req, res, next) {
    res.json(req.cookies.token)
})
app.listen(3000, function () {
    console.log("ket noi thanh cong tai cong 3000");
})