/*------------------------------------主文档----------------------------------------------*/
/*require模块 == import导入所需的组件*/
/*导入express框架*/
var express = require('express');
var app = express();
/*注册mongoose组件*/
var mongoose = require('./db');
//异步操作数据库
mongoose.Promise = global.Promise;


// //导入数据模型
var User = require('./models/users.model')
var Feedback = require('./models/feedback.model')
var Found = require('./models/found.model')
var Lost = require('./models/lost.model')


// var path = require('path');
// let fs = require('fs');
// //导入所有连接数据库的模块
// var modelsPath = path.join(__dirname,'models');
// fs.readdirSync(modelsPath),forEach(function (file) {
//   if (/(.*)\.(js$|coffee$)/.test(file)){
//       require(modelsPath+'/'+file);
//   }
// });


/*注册路由级中间件*/
var router = require('./routers/route_app');
router(app)

/*监听服务器*/
var server = app.listen(88, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://127.0.0.1', host, port);
});