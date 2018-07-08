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
exports.savePerson_detail = function (uid , data) {
    var newarr = []  //清洗数据
    var arr = data.replace(/{/,'').replace(/}/,'').replace(/"/g,'').split(",")
    arr.forEach(function (item) {
        var index  = item.indexOf("\:")
        var i = item.substring(index+1,item.length)
        newarr.push(i)
    })
    //重构数据
    var newdata = {
        "uid":uid,
        "user_name":newarr[0],
        "user_sex":newarr[1],
        "user_language":newarr[2],
        "user_city":newarr[3],
        "user_province":newarr[4],
        "user_country":newarr[5],
        "user_avatarUrl":newarr[6],
        "register_time":Date.now()
    }
    User.findOne({uid:uid},function (err,res) {
        if (res == null){
            User.create(newdata).then(function (info) { //异步保存用户信息
                console.log("successCreate_user")
            }).catch(function (err){
                if (err.errors && err.errors.name) {
                    err = {error_msg: err.errors.name.message}
                    console.log(err)
                }
            });
        }else {
            //更新一次用户信息
            // User.updateAsync({uid:uid},{},function(req,res){
            //
            // });
            console.log("该用户已存在!")
        }
    })
}