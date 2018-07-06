//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        this.globalData.code = res.code; //获取用户登录凭证
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.globalData.if_authSetting_userInfo = true
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              //防止渲染顺序错乱的情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    //http_src:'http://127.0.0.1:88',
    http_src: 'https://www.cahoder.cn:8080',
    if_authSetting_userInfo:false,
    userInfo: null,
    code:null
  }
})