const app = getApp()
Page({
  data: {
    baseurl: 'https://tycaching.cn/qihntest/',
    jifen:1
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  goback: function (options) {
    wx.navigateBack({
      delta: 2
    })
  },
  
  onLoad: function (options) {
    console.log("onLoad " + options)
    this.setData({
      jifen: options.jifen
    })

  }


})
