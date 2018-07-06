Page({
  data: {
    
  },
  formSubmit: function (e) {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value.text)
    wx.showToast({
      title: '暂未开放',
      icon: 'none',
      duration: 1000
    })
  }
})