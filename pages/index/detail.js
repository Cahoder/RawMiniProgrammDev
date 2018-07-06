const app = getApp();   //调用app.js

Page({
  data: {
    content:{},
    ClassChange: ["全部", "一卡通", "日常用品", "数码电子", "身份证件", "衣服首饰", "课本教材", "箱包", "其他"],
    had_befound: ['未找到', '已找到'],
    _id:0,
    type_:'',
    http_src: app.globalData.http_src
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this
    that.setData({
      _id: option._id,
      type_:option.type_
    })
    switch (option.type_) {
      //寻找失物
      case 'xzsw':
        wx.request({
          url: app.globalData.http_src +'/api/v1/lost/detail?_id='+option._id, //仅为示例，并非真实的接口地址
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            that.setData({
              content: res.data.data[0]
            })
          }
        })
      break;
      case 'xzsz':
        wx.request({
          url: app.globalData.http_src +'/api/v1/found/detail?_id=' + option._id, //仅为示例，并非真实的接口地址
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            that.setData({
              content: res.data.data[0]
            })
          }
        })
      break;
    }
  },
  
  col_click: function () {
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 1000
    })
  },
  return_home:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  call_to:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id
    })
  },

  onShareAppMessage:function(res){
    return {
      path: '/pages/index/index?detail_id='+this.data._id+'&detailtype_='+this.data.type_,//这里填写首页的地址,附带当前页面的子id和帖子类型
    }
  }
})