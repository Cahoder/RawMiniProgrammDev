var express = require('express');
var router = express.Router();
var controller = require('./feedback.controller')
//下面根据约定写指定的请求方法和路由去的路径和指定的控制器

router.post('/',controller.feedback);

module.exports = router;