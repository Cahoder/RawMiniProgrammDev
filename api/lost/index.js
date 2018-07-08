var express = require('express');
var router = express.Router();
var controller = require('./lost.controller');//引入数据控制器对数据库进行操作

//下面根据约定写指定的请求方法和路由去的路径和指定的控制器
router.get('/',controller.getlost);
router.post('/postlost',controller.postlost);
router.get('/detail',controller.showdetail);
router.post('/updateiffound',controller.updateiffound);
router.delete('/postlost/delete',controller.deletelost);

/*----------------multer 配置参数---------------------*/
var multer = require('multer')
var storage = multer.diskStorage({   //硬盘储存
    destination: function (req, file, cb) {
        cb(null, 'public/upimgs/lost/')
    },
    filename: function (req, file, cb) {
        var img_type = file.mimetype
        var reg =/[/]/;  //正则切割字符串
        var res =img_type.split(reg)
        if (res[0]=='image') {
            new_file_name = Date.now()+req.body._id+req.body.upname+'.'+res[1];
            cb(null, new_file_name)
        }else{
            new_file_name = Date.now()+req.body._id+req.body.upname+'.jpg';
            cb(null, new_file_name)
        }
    }
})
var upload = multer({ storage: storage })
/*-------------------------------------------------*/

//保存上传的图片
router.post('/postlost/upimg', upload.array('upimages', 6), function(req, res, next){
    imgurl = req.files[0].destination+req.files[0].filename;
    var state = controller.postlostimg_url(req.body._id,imgurl);  //将图片地址插入数据库
    // console.log(req.files[0].destination+req.files[0].filename)// req.files 是 `upimages` 文件数组的信息
    //console.log(req.body)// req.body 将具有文本域数据，如果存在的话
    if (state) {
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        return res.status(200).send('success');
    }
})

module.exports = router;