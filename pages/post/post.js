const app = getApp();
Page({
  data: {
    type_items: [
      { name: 'xzsz', value: '物寻'},
      { name: 'xzsw', value: '寻物'},
    ],

    option_index:0,
    option_type: ["请选择", "一卡通", "日常用品", "数码电子", "身份证件", "衣服首饰", "课本教材", "箱包", "其他"],
    imglist:[],
    value:''
  },

//判断当前点击的是寻找失物还是寻找失主
  radioChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  //改变当前的物品分类
  bindPickerChange: function (e) {
    this.setData({
      option_index: e.detail.value
    })
  },

//通过拍照或者相册获取图片
  checkimg: function (){
    let self = this
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            wx.chooseImage({
              count: 3, // 默认9
              sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album'], // 指定来源是相册
              success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                self.setData({
                  imglist: tempFilePaths
                })
              }
            })
          } 
          else if (res.tapIndex == 1) {
            wx.chooseImage({
              count: 3, // 默认9
              sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['camera'], // 指定来源是相机
              success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                self.setData({
                  imglist: tempFilePaths
                })
              }
            })
          }
        }
      }
    })
  },

  //提交from表单
  formSubmit:function(e){
    var that = this
    if (app.globalData.if_authSetting_userInfo == false) {
      wx.showToast({
        title: '请先授权后再发布帖子！',
        icon: 'none',
        duration: 1000
      })
    }else if(e.detail.value.title==""){
      wx.showToast({
        title: '标题为空！',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function(){
        wx.hideToast()
      }, 2000)
    }else if (e.detail.value.content == ""){
      wx.showToast({
        title: '内容为空！',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else if (e.detail.value.type == "") {
      wx.showToast({
        title: '请选择类型！',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else if (e.detail.value.position == "") {
      wx.showToast({
        title: '请输入位置！',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else if (e.detail.value.type == "") {
      wx.showToast({
        title: '请选择帖子分类！',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else if (e.detail.value.goods_type=="0"){
      wx.showToast({
        title: '请选择物品类型！',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else if (e.detail.value.tele == "") {
      wx.showToast({
        title: '电话为空！',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    }else if (e.detail.value.tele.length != "11") {
      wx.showToast({
        title: '电话输入有误！',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    }else{
      let openid = wx.getStorageSync('openid') //用后端服务器请求获取到的用户的openid 
      var user_name = app.globalData.userInfo.nickName  //请求全局变量获取用户名
      var user_avatarUrl = app.globalData.userInfo.avatarUrl  //请求全局变量获取用户头像
      var myDate = new Date(); //现在的时间戳
      var now_date = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()  //拿到日期
      var from_other_data = {
        "uid": openid, 
        "user_name":user_name,
        "user_avatarUrl": user_avatarUrl,
        "title": e.detail.value.title, 
        "content": e.detail.value.content, 
        "type_": e.detail.value.type,
        "position":e.detail.value.position,
        "goods_type": e.detail.value.goods_type,
        "telephone":e.detail.value.tele,
        "if_befound":'0',  //默认没有找到
        "publish_time": now_date,
        "borwser_times":'0'
        };
        
        wx.showLoading({
          title: '上传中...',
        })
      switch (e.detail.value.type){
        //寻找失物
        case 'xzsw':
        if (that.data.imglist.length>1){
          //如果用户放了两张图片以上
          wx.request({
            url: app.globalData.http_src +'/api/v1/lost/postlost', //仅为示例，并非真实的接口地址
            method:'POST',
            data: from_other_data,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              let _id = res.data._id
              var successTime = []
              console.log("准备上传多张图片。。。")
              for (var i = 0, h = that.data.imglist.length; i < h; i++) {
                var s = that.upload_file(app.globalData.http_src +"/api/v1/lost/postlost/upimg", that.data.imglist[i], 'lostpic' + i, _id)
                successTime.push(s)
              }
              if (successTime.length == that.data.imglist.length){
                wx.hideLoading()
                wx.showToast({
                  title: "上传完成！",
                  icon: 'success',
                  duration: 1000,
                  success:function(){
                    successTime = []
                  }
                })

                //准备清空表单
                setTimeout(
                  function () {
                    that.setData({
                      val: '',
                      option_index: 0,
                      imglist: [],
                    })
                  }, 1100
                )
              }else{
                wx.hideLoading()
                wx.showToast({
                  title: "上传失败！",
                  icon: 'none',
                  duration: 700,
                  success: function () {
                    successTime = []
                  }
                })
              }
              
            },
            fail:function(res){
              
            },
            complete: function (res) {
              if (res.statusCode == '422') {
                wx.hideLoading()
                wx.showToast({
                  title: res.data.error_msg,
                  icon: 'none',
                  duration: 700
                })
              }
            }
          })
        }else if(that.data.imglist.length<1){
          //如果用户没有放图片
          wx.request({
            url: app.globalData.http_src +'/api/v1/lost/postlost', //仅为示例，并非真实的接口地址
            method: 'POST',
            data: from_other_data,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              
              console.log('你没有提交图片')
              if(res.statusCode == '200'){
                wx.hideLoading()
                wx.showToast({
                  title: "上传完成！",
                  icon: 'success',
                  duration: 1000
                })

                //准备清空表单
                setTimeout(
                  function () {
                    that.setData({
                      val: '',
                      option_index: 0,
                      imglist: [],

                    })
                  }, 1100
                )
              }
            },
            fail:function(res){
              
            },
            complete:function(res){
              if(res.statusCode == '422'){
                wx.hideLoading()
                wx.showToast({
                  title: res.data.error_msg,
                  icon: 'none',
                  duration: 700
                })
              }
            }
          })
        }else{
          //如果用户只放了一张图片
          wx.request({
            url: app.globalData.http_src +'/api/v1/lost/postlost', //仅为示例，并非真实的接口地址
            method: 'POST',
            data: from_other_data,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              let _id = res.data._id
              console.log("准备上传1张图片。。。")
              
              var s = that.upload_file(app.globalData.http_src +"/api/v1/lost/postlost/upimg", that.data.imglist[0], "lostpic1", _id)
              if(s){
                wx.hideLoading()
                wx.showToast({
                  title: "上传完成！",
                  icon: 'success',
                  duration: 1000
                })

                //准备清空表单
                setTimeout(
                  function () {
                    that.setData({
                      val: '',
                      option_index: 0,
                      imglist: [],

                    })
                  }, 1100
                )
              }
              
            },
            fail:function(res){
             
            },
            complete: function (res) {
              if (res.statusCode == '422') {
                wx.hideLoading()
                wx.showToast({
                  title: res.data.error_msg,
                  icon: 'none',
                  duration: 700
                })
              }
            }
          })
        }
        break;
        //寻找失主
        case 'xzsz':
          if (that.data.imglist.length>1) {
            //如果用户放了两张图片以上
            wx.request({
              url: app.globalData.http_src +'/api/v1/found/postfound', //仅为示例，并非真实的接口地址
              method: 'POST',
              data: from_other_data,
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                let _id = res.data._id
                var successTime = []
                console.log("准备上传多张图片。。。")
                for (var i = 0, h = that.data.imglist.length; i < h; i++) {
                  var s = that.upload_file(app.globalData.http_src +"/api/v1/found/postfound/upimg", that.data.imglist[i], 'foundpic' + i, _id)
                  successTime.push(s)
                }
                if (successTime.length == that.data.imglist.length) {
                  wx.hideLoading()
                  wx.showToast({
                    title: "上传完成！",
                    icon: 'success',
                    duration: 1000,
                    success: function () {
                      successTime = []
                    }
                  })

                  //准备清空表单
                  setTimeout(
                    function () {
                      that.setData({
                        val: '',
                        option_index: 0,
                        imglist: [],

                      })
                    }, 1100
                  )

                } else {
                  wx.hideLoading()
                  wx.showToast({
                    title: "上传失败！",
                    icon: 'none',
                    duration: 700,
                    success: function () {
                      successTime = []
                    }
                  })
                }
              },
              complete: function (res) {
                if (res.statusCode == '422') {
                  wx.hideLoading()
                  wx.showToast({
                    title: res.data.error_msg,
                    icon: 'none',
                    duration: 700
                  })
                }
              }
            })
          } 
          else if (that.data.imglist.length<1) {
            //如果用户没有放图片
            wx.request({
              url: app.globalData.http_src +'/api/v1/found/postfound', //仅为示例，并非真实的接口地址
              method: 'POST',
              data: from_other_data,
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {

                console.log('你没有提交图片')
                if (res.statusCode == '200') {
                  wx.hideLoading()
                  wx.showToast({
                    title: "上传完成！",
                    icon: 'success',
                    duration: 1000
                  })

                  //准备清空表单
                  setTimeout(
                    function () {
                      that.setData({
                        val: '',
                        option_index: 0,
                        imglist: [],

                      })
                    }, 1100
                  )
                }
              },
              fail: function (res) {

              },
              complete: function (res) {
                if (res.statusCode == '422') {
                  wx.hideLoading()
                  wx.showToast({
                    title: res.data.error_msg,
                    icon: 'none',
                    duration: 700
                  })
                }
              }
            })
          }else {
             //如果用户只放了一张图片
            wx.request({
              url: app.globalData.http_src +'/api/v1/found/postfound', //仅为示例，并非真实的接口地址
              method: 'POST',
              data: from_other_data,
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                let _id = res.data._id
                console.log("准备上传1张图片。。。")
                var s = that.upload_file(app.globalData.http_src +"/api/v1/found/postfound/upimg", that.data.imglist[0], "foundpic1", _id)
                if (s) {
                  wx.hideLoading()
                  wx.showToast({
                    title: "上传完成！",
                    icon: 'success',
                    duration: 1000
                  })

                  //准备清空表单
                  setTimeout(
                    function () {
                      that.setData({
                        val: '',
                        option_index: 0,
                        imglist: [],

                      })
                    }, 1100
                  )
                }
              },
              complete: function () {
                if (res.statusCode == '422') {
                  wx.hideLoading()
                  wx.showToast({
                    title: res.data.error_msg,
                    icon: 'none',
                    duration: 700
                  })
                }
              }
            })
          }
        break;
      }
    }
  },

  //上传数据的function
  upload_file: function (url, filePath, upfilename, _id) {
    var su = wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'upimages',
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      formData: {
        '_id': _id,
        'upname': upfilename
        },
      success:function(res){
        if(res){
          return res.data;
        }
      }
    })
    if(su){
      return "success";
    }
  }
})