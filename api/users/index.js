var express = require('express');
var router = express.Router();
var controller = require('./users.controller');//引入数据控制器对数据库进行操作
//下面根据约定写指定的请求方法和路由去的路径和指定的控制器
router.get('/',controller.userlist);

router.get('/Postings',controller.postings)

module.exports = router;