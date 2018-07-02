/**
 * 使用mongoose模块中的Schema映射模式创建数据表的结构并建立可操作数据表的数据模型model
 */
'use strict';

/**
 * 拾取物品数据库结构信息
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;//引入schema模式


//定义数据表（collection）的结构
var options = {
    _id : true,             //Boolean, 唯一索引, 如果不需要,可以设置为false关闭
    collection : 'found',   //在MongDB中默认使用Model的名字作为集合的名字，如过需要自定义集合的名字，可以通过设置这个选项
    versionKey : '__v1'     //包含文档的内部修订,默认的是__v
};

var FoundSchema = new Schema({
    uid:{type:String},  //用户对应的openid
    user_name:{type: String},   //发布的用户
    user_avatarUrl:{type:String}, //发布的用户的头像
    prc_img:[{
        img_list:{type: String}
    }],//丢失的物品的图片储存地址
    title:{type:String},//拾取的物品的名字
    content:{type:String},//拾取的物品的描述
    goods_type:{type:String},//拾取的物品的类型 一个数字代表一种类型
    telephone:{type:String},//联系电话
    position:{type:String},//拾取的位置
    publish_time:{type:String},//发布时间
    if_befound:{type:String},//是否被找到，默认为否
    type_:{type:String},  //帖子的类型
    borwser_times:{type:String} //浏览次数
}, options);



//检测当前数据模型名字是否被使用了
// FoundSchema
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


var Found_ = mongoose.model('Found_',FoundSchema);//创建模型
var Promise = require('bluebird');
Promise.promisifyAll(Found_);
Promise.promisifyAll(Found_.prototype);

module.exports = Found_;//建立模块，令全局可以访问这个模块