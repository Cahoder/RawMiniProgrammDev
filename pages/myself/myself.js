//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    ClassChange: ["请选择", "一卡通", "日常用品", "数码电子", "身份证件", "衣服首饰", "课本教材", "箱包", "其他"],
    had_befound: ['未找到', '已找到'],
    example:[],
    isChecked:false,
    http_src: app.globalData.http_src
  },

  onLoad: function (option) {
    var that = this
    wx.showToast({
      title: '请稍候',
      icon: 'loading'
    })
    wx.request({
      url: app.globalData.http_src +'/api/v1/users/Postings?uid='+option.uid,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          example: res.data,
        })
      },
      complete:function(){
        wx.hideToast()
      }
    })
  },
  switchChange:function(e){
    var that = this
    var clickid = e.currentTarget.dataset.id
    wx.showModal({
      title: '温馨提示',
      content: '确认已找回无法修改噢!',
      confirmText: '已找回',
      cancelText: '未找回',
      success: function (res) {
        if (res.confirm) {
          var newl = e.currentTarget.id.split(/5201314520/)
          if (newl[1] == 'xzsw') {
            newl[1] = 'lost'
            that.updatefound(newl,clickid)
          } else {
            newl[1] = 'found'
            that.updatefound(newl,clickid)
          }
        }else if (res.cancel) {
          setTimeout(function () {
            that.setData({
              isChecked: false
            })
          }, 100)
        }
      }
    })
  },
  updatefound:function(e,id){
    var that = this
    if(e[2]=='0'){
      e[2] = '1'
    }else{
      e[2] = '0'
    }
    wx.request({
      url: app.globalData.http_src +'/api/v1/' + e[1] +'/updateiffound',
      method: 'POST',
      data: {
        '_id':e[0],
        'if_befound':e[2]
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.statusCode == '200') {
          //进行局部刷新
          setTimeout(function () {
            that.setData({
              ["example[" + id + "].if_befound"]: e[2]
            })
          }, 500)
        }
      },
      fail: function (res) {
      }
    })
  },
  deltouch:function(e){
    var that = this
    wx.showModal({
      title: '温馨提示',
      content: '确认删除无法恢复噢!',
      confirmText: '狠心删除',
      cancelText: '考虑考虑',
      success: function (res) {
        if (res.confirm) {
          //进行删除
          var newl = e.currentTarget.id.split(/5201314520/)
          if (newl[1] == 'xzsw') {
            newl[1] = 'lost'
          } else {
            newl[1] = 'found'
          }
          wx.request({
            url: app.globalData.http_src +'/api/v1/' + newl[1] + '/post' + newl[1]+'/delete?del_id='+newl[0],
            method:'DELETE',
            success:function(res){
              if (res.statusCode == '200') {
                var list = that.data.example
                //准备进行局部刷新
                setTimeout(function () {
                  var newlist = list.splice(e.currentTarget.dataset.index, 1)  //newlist 里面保存的是删掉的那一条
                  that.setData({
                    example:list
                  })
                }, 1000)

              }
            }
          })
        }else if(res.cancel){
        }
      }
    })
  }
})

