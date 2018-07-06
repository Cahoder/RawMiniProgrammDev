  const app = getApp();   //调用app.js
  //const worker = wx.createWorker('workers/request_img.js') // 文件名指定 worker 的入口文件路径，绝对路径
Page({
  data: {
    _start:10,
    havedata:true,//是否显示加载GIF true为不显示
    nodata: true, //提示后面没数据了 true为不显示
    tabs: ["寻物", "物寻"],
    activeIndex: 0,
    show:0,
    example:[],
    newexample:[],

    areaChange: ['南海校区','广州校区'],
    area_index:0,
    ClassChange: ["全部", "一卡通", "日常用品", "数码电子", "身份证件", "衣服首饰", "课本教材", "箱包", "其他"],
    had_befound:['未找到','已找到'],
    Class_index: 0,
    http_src: app.globalData.http_src
  },
  onLoad:function(option){
    if (option.detail_id && option.detailtype_){  //如果有子页面的id存在type_存在
      wx.navigateTo({
        url: './detail?_id=' + option.detail_id + '&type_=' + option.detailtype_,
      })
    }
  },
//校区更改
  areaChange: function (e) {
    //改变area_index值，通过setData()方法重绘界面
    this.setData({
      area_index: e.detail.value,
      Class_index: 0
    });  
  },
  //类别更改
  ClassChange: function (e) {
    //改变Class_index值，通过setData()方法重绘界面
    this.setData({
      Class_index: e.detail.value,
    });
  },
  //寻物物寻切换
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id,
      show: e.currentTarget.id,
      area_index: 0,
      Class_index: 0
    });
    this.changerequest(e.currentTarget.id)
  },


//改变请求寻物还是物寻
  onShow: function () {
    if (this.data.show == '0') {
      this.request_lost()
    }
    if (this.data.show == '1') {
      this.request_found()
    }
  },
  changerequest:function(e){
    if(e=='0'){
      this.request_lost()
    }
    if(e == '1'){
      this.request_found()
    }
  },

  request_lost:function(){
    var that = this
    that.setData({
      example: [],
      havedata: true,//是否显示加载GIF true为不显示
      nodata: true, //提示后面没数据了 true为不显示
      _start: 10
    })
      wx.showLoading({
        title: '加载中',
      })
      
      wx.request({
        url: app.globalData.http_src+'/api/v1/lost?_start=0',
        method:'GET',
        success: function (res) {
          //console.log('请求一次寻物')
          if (res.data.ifdata == true) {
            that.setData({
              example: res.data.lostlist,
              havedata: res.data.ifdata,
              nodata: false
            });
          } else {
            that.setData({
              example: res.data.lostlist,
              havedata: res.data.ifdata
            });
          }
          wx.hideLoading()
        },
      })
      
  },
  request_found: function () {
    var that = this
    that.setData({
      example: [],
      havedata: true,//是否显示加载GIF true为不显示
      nodata: true, //提示后面没数据了 true为不显示
      _start: 10
    })
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.http_src +'/api/v1/found?_start=0',
        method: 'GET',
        success: function (res) {
          //console.log('请求一次物寻')
          if (res.data.ifdata == true) {
            that.setData({
              example: res.data.foundlist,
              havedata: res.data.ifdata,
              nodata: false
            });
          } else {
            that.setData({
              example: res.data.foundlist,
              havedata: res.data.ifdata
            });
          }
          wx.hideLoading()
        }
      })
  },

  onReachBottom: function () {
    var that = this
    var text
    if (that.data.show == '0') {
      text = 'lost'
    } else if (that.data.show == '1') {
      text = 'found'
    }
    if(that.data.havedata ==false){
      setTimeout(function () { //进行插队最先执行
        that.setData({
          havedata: true
        });
      }, 0)
      setTimeout(function (){  //定时器300毫秒之后执行
      wx.request({
        url: app.globalData.http_src +'/api/v1/' + text + '?_start=' + that.data._start,
        method: 'GET',
        success: function (res) {
          var list = that.data.example
          if(res.data.lostlist){
            res.data.lostlist.forEach(function (t) {
              list.push(t)
            })
          }if(res.data.foundlist){
            res.data.foundlist.forEach(function (t) {
              list.push(t)
            })
          }
          if(res.data.ifdata == true){
            that.setData({
              example: list,
              havedata: res.data.ifdata,
              nodata:false
            });
          }else{
            that.setData({
              example: list,
              havedata: res.data.ifdata,
            });
            setTimeout(function(){
              that.setData({
                _start:that.data._start + 10
              });
            },100)
          }
        }
      })
      }, 300)
    }
  },

  /**
    * 用户点击右上角分享
    */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '倾尽所有只为寻你!',
      path: '/pages/index/index',//这里填写首页的地址
      success: function (res) {
        // 转发成功
        
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
