var express = require('express');
var router = express.Router();
request = require('request')
var user = require('../users/users.controller');

//这里用来请求微信服务器换取小程序登陆所需的参数

router.get('/', function (req, res, next) {
    let code = req.query.code;
    request.get({
        uri: 'https://api.weixin.qq.com/sns/jscode2session',
        json: true,
        qs: {
            grant_type: 'authorization_code',
            appid: 'wx2aa886668f07482a',  //需要改成自己的appid
            secret: 'ba0b1728823ffdd103652663ecc1ff1c',  //需要改成自己的secret
            js_code: code
        }
    }, (err, response, data) => {
        if (response.statusCode === 200) {
            ////TODO: 生成一个唯一字符串sessionid作为键，将openid和session_key作为值，存入redis，超时时间设置为2小时
            //伪代码: redisStore.set(sessionid, openid + session_key, 7200)
            // res.json({ sessionid: sessionid })

            var sessionid={
                "openid": data.openid,
                "session_key":data.session_key
            }
            user.savePerson_detail(data.openid,req.query.personDetail);  //后台保存用户信息
            return res.status(200).json(sessionid);
        } else {
            console.log("[error]", err)
            res.json(err)
        }
    })
})

module.exports = router;