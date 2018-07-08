'use strict';

var mongoose = require('mongoose');//应用mongoose模块
var Found_ = mongoose.model('Found_');  //应用在哪个模块路径
var fs = require("fs");

//下面是对数据库的增删改查更的方法


//获取已发布帖子
exports.getfound = function(req, res, next){
    let limit_int = 10
    let skip_start = parseInt(req.query._start) //字符串转数字
    let next_start = skip_start+limit_int
    var query = Found_.find({}, null, { limit: limit_int ,skip: skip_start }).sort({"publish_time":-1});  //查询数据 限制长度为10 下标为skip_start的数据开始
    var next_query = Found_.find({}, null, { limit: 1 ,skip: next_start });  //预先查询后面还有没有数据
    query.then(function (foundlist){
        next_query.then(function (ifdata){
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            if (ifdata.length != 0){
                return res.status(200).json({ifdata: false, foundlist: foundlist});
            }else{
                return res.status(200).json({ifdata: true, foundlist: foundlist});
            }
        })
    }).catch(function (err) {
        return next(err);
    });
}
//发布帖子
exports.postfound = function(req, res){
    var uid = req.body.uid;  //传过来的uid
    var user_name = req.body.user_name?req.body.user_name.replace(/(^\s+)|(\s+$)/g, ""):'';  //三目运算符
    var title = req.body.title?req.body.title.replace(/(^\s+)|(\s+$)/g, ""):'';
    var content = req.body.content?req.body.content.replace(/(^\s+)|(\s+$)/g, ""):'';
    var goods_type = req.body.goods_type?req.body.goods_type.replace(/(^\s+)|(\s+$)/g, ""):'';
    var position = req.body.position?req.body.position.replace(/(^\s+)|(\s+$)/g, ""):'';
    var telephone = req.body.telephone?req.body.telephone.replace(/(^\s+)|(\s+$)/g, ""):'';
    var type_ = req.body.type_?req.body.type_.replace(/(^\s+)|(\s+$)/g, ""):'';
    var if_befound = req.body.if_befound;

    var foundpost_error_msg;
    if (uid===''){
        foundpost_error_msg='提交的uid为空';
    }else if(user_name === ''){
        foundpost_error_msg = "提交的用户昵称为空";
    }else if(title === ''){
        foundpost_error_msg = "拾取帖子标题为空";
    }else if(content===''){
        foundpost_error_msg = "拾取帖子描述内容为空";
    }else if (type_!=='xzsz'){
        foundpost_error_msg='帖子类型错误';
    }else if (position===''){
        foundpost_error_msg='位置信息为空';
    }else if(goods_type===''){
        foundpost_error_msg = "物品分类为空";
    }else if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(telephone))){
        foundpost_error_msg="手机号输入有误";
    }else if (if_befound!=='0'){
        foundpost_error_msg='前端传送数据错误';
    }
    res.setHeader('Content-Type', 'application/json;charset=utf-8');

    if(foundpost_error_msg){
        return res.status(422).send({error_msg:foundpost_error_msg});
    }

        var newFound_ = new Found_(req.body);
        // newFound_.role = 'user';

        newFound_.saveAsync().then(function (info) {
            return res.status(200).json({success: true, message: "上传成功",_id:info._id});
        }).catch(function (err){
            if (err.errors && err.errors.name) {
                err = {error_msg: err.errors.name.message}
                console.log(err)
            }
            return res.status(500).send({error_msg:"上传失败"});
        });
}
exports.postfoundimg_url = function(_id, img_url){
    //将图片地址插入数据库
    var uping = Found_.updateAsync({_id:_id},{$addToSet:{"prc_img":{"img_list":img_url}}},function(req,res){
        if (res){
            return res;
        }
    });
    if (uping){
        return uping;
    }
}
//展示帖子详细信息
exports.showdetail = function(req, res){
    var _id = req.query._id
    Found_.find({_id:_id}).exec().then(function (founddetail) {
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        return res.status(200).json({success: true,data: founddetail});
    }).catch(function (err) {
        return res.status(500).send(err);
    })
}
//标记是否被找到
exports.updateiffound = function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    Found_.updateAsync({_id:req.body._id},{if_befound:req.body.if_befound},function(req,res){
        if (res){

        }
    })
    return res.status(200).json({success: "updatefoundsuccess"});
}
//删除已发布的帖子
exports.deletefound = function(req, res){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    var img_list = [];
    Found_.findOne({ _id: req.query.del_id},function(err, doc){
        if (doc && doc.prc_img!= null){
            doc.prc_img.forEach(function (item) {
                img_list.push(item.img_list)
            })
            img_list.forEach(function (item) {
                //删除携带的图片
                fs.unlink(item,function (s) {
                    //删除成功
                })
            })
        }else if (err){
            console.log("删除图片有错误！")
            console.error(err)
        }
    });
    //定时器
    setTimeout(function () {
        Found_.remove({_id: req.query.del_id},function (error) {
            if (error) {
                console.error(error);
                return res.status(403).send({status:"error", message:"delete fail"});
            } else {

                return res.status(200).send({status:"success", message:"delete success"});
            }
        });
    },500)
}
