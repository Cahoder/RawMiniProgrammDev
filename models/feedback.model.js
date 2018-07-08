/**
 * 使用mongoose模块中的Schema映射模式创建数据表的结构并建立可操作数据表的数据模型model
 */
'use strict';

/**
 * 用户回馈数据库结构信息
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;//引入schema模式


//定义数据表（collection）的结构
var options = {
    _id : true,             //Boolean, 唯一索引, 如果不需要,可以设置为false关闭
    collection : 'feedback',   //在MongDB中默认使用Model的名字作为集合的名字，如过需要自定义集合的名字，可以通过设置这个选项
    versionKey : '__v1'     //包含文档的内部修订,默认的是__v
};

var FeedbackSchema = new Schema({
    feedback_user_uid : {type: String},       //反馈的用户名
    feedback_user_name : {type: String},       //反馈的用户名
    feedback_time:{type: String},                   //反馈时间
    feedback_content:{type:String}                //反馈内容
}, options);



//
// FeedbackSchema
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
//     }, '这个呢称已经被使用.');F


var Feedback = mongoose.model('Feedback', FeedbackSchema);//创建模型
var Promise = require('bluebird');
Promise.promisifyAll(Feedback);
Promise.promisifyAll(Feedback.prototype);

module.exports = Feedback;//建立模块，令全局可以访问这个模块