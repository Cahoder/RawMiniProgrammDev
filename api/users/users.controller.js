'use strict';

var mongoose = require('mongoose');//应用mongoose模块
var User = mongoose.model('User');  //调用User集合
var Found_ = mongoose.model('Found_');  //调用Found_集合
var Lost = mongoose.model('Lost');  //调用Lost集合

//下面是对数据库的增删改查更的方法
exports.userlist = function(req,res) {
    //查看用户信息

};
exports.postings = function(req,res) {
    //查看用户发布的帖子
    Lost.find({uid:req.query.uid},function (err,data) {
        var user_postings = data
        Found_.find({uid:req.query.uid},function (err,data) {
            data.forEach( function(t) {
                user_postings.push(t)
            });
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            return res.status(200).json(user_postings);
        })
    })


};