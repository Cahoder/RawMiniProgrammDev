'use strict';

var mongoose = require('mongoose');//应用mongoose模块
var Feedback = mongoose.model('Feedback');  //应用在哪个模块路径

exports.feedback = function (req,res) {
    var feedback = new Feedback(req.body);
    feedback.saveAsync().then(function (info) {
        return res.status(200).json({success: true});
    }).catch(function (err){
        if (err.errors && err.errors.name) {
            err = {error_msg: err.errors.name.message}
            console.log(err)
        }
        return res.status(500).send({error_msg:"fail"});
    });
}

//下面是对数据库的增删改查更的方法
