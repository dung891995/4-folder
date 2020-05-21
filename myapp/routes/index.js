var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',user:[{name:"dung",address:"hà nội"},{name:"admin",address:"hà nội"}] });
});



module.exports = router;
if (condition) {
  
} else {
  
}