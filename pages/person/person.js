//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    list_tab: ['我的帖子', '我的收藏', '反馈内容', '关于轻觅'],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        
      },
      fail: function (res){  //防止用户删除小程序数据
        if (app.globalData.code && app.globalData.if_authSetting_userInfo == true) {
          wx.request({
            url: app.globalData.http_src +'/api/v1/wx/login',
            data: { code: app.globalData.code},
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.setStorage({
                key: "openid",
                data: res.data.openid
              })
            }
          })
        }
      }
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    if(e.detail.errMsg){
      console.log("你取消了授权")
    }
    if(e.detail.rawData){
      console.log("授权成功")
      app.globalData.userInfo = e.detail.userInfo  //保存用户信息为全局数据
      app.globalData.if_authSetting_userInfo = true //已授权
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      // --------- 发送凭证 ------------------
      if (app.globalData.code){
      wx.request({
        url: app.globalData.http_src +'/api/v1/wx/login',
        data: { code: app.globalData.code, personDetail: app.globalData.userInfo },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          wx.setStorage({
            key: "openid",
            data: res.data.openid
          })
        }
      })
      }
      // ------------------------------------
    }
  },


  bindViewTap:function(e){
    if (app.globalData.if_authSetting_userInfo == true){
      switch (e.currentTarget.id) {
        //寻找失物
        case '0':
          wx.navigateTo({
            url: '/pages/myself/myself?uid='+wx.getStorageSync('openid'),
          })
          break;
        case '1':
          wx.showToast({
            title: '暂未开放',
            icon: 'none',
            duration: 1000
          })
          /*wx.navigateTo({
            url: '/pages/collect/collect',
          })*/
          break;
        case '2':
          wx.navigateTo({
            url: '/pages/feedback/feedback',
          })
          break;
        case '3':
          wx.navigateTo({
            url: '/pages/about/about',
          })
          break;
      }
    }else{
      wx.showToast({
        title: '请先授权',
        icon: 'none',
        duration: 1000
      })
    }
  }
})
