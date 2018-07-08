/**
 * 使用mongoose模块中的Schema映射模式创建数据表的结构并建立可操作数据表的数据模型model
 */
'use strict';

/**
 * 用户数据库结构信息
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;//引入schema模式


//定义数据表（collection）的结构
var options = {
    _id : true,             //Boolean, 唯一索引, 如果不需要,可以设置为false关闭
    collection : 'users',   //在MongDB中默认使用Model的名字作为集合的名字，如过需要自定义集合的名字，可以通过设置这个选项
    versionKey : '__v1'     //包含文档的内部修订,默认的是__v
};

var UserSchema = new Schema({
    uid:{type:String},  //用户对应的openid
    user_name:{type: String},   //发布的用户
    user_avatarUrl:{type:String}, //用户的头像地址
    user_sex:{type:String},                 //用户性别 女0男1
    user_province:{type:String},            //用户省份
    user_city:{type:String},                //用户城市
    user_country:{type:String},             //用户国家
    user_language:{type:String},             //用户语言
    register_time:{type:Date}                //注册时间
}, options);



//
// UserSchema
//     .path('name')
//     .validate(function(value, respond) {
//         var self = this;
//         this.constructor.findOne({name: value}, function(err, user) {
//             if(err) throw err;
//             if(user) {
//                 if(self.id === user.id) return respond(true);
//                 return respond(false);
//             }
//             respond(true);
//         });
//     }, '这个呢称已经被使用.');


var User = mongoose.model('User', UserSchema);//创建模型
var Promise = require('bluebird');
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

module.exports = User;//建立模块，令全局可以访问这个模块