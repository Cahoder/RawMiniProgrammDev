    var express = require('express');
    var path = require('path');


    var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: true,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now());
    }
};

    var route = function(app) {
    //设置允许跨域
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By",' 3.2.1');
        res.header("Content-Type", "application/json;charset=utf-8");
        next();
    });

        var bodyParser = require('body-parser');//添加解析中间件
        app.use(bodyParser.urlencoded({ extended: true }));//解析字符串
        app.use(bodyParser.json()); // 解析json

    /*路由*/
    app.use('/api/v1/wx/login',require('../api/login'));  //让小程序经过自己的服务器进行验证
    app.use('/api/v1/feedback',require('../api/feedback'));
    app.use('/api/v1/found',require('../api/found'));
    app.use('/api/v1/lost',require('../api/lost'));
    app.use('/api/v1/users',require('../api/users'));


    //在这里写约定文档
    app.use('/api/v1/*', function (req,res,next){
        return res.status(200).json({
            '获取登陆状态':'http://127.0.0.1:88/api/v1/wx/login',
        });
    });
    //访问静态资源
    app.use('/public', express.static('public'));
};

module.exports = route;//对路由方法进行封装成模块
