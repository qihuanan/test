const app = getApp()
Page({
  data: {
    baseurl: app.globalData.baseurl,
    distance: '',
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  goback: function (options) {
    wx.navigateBack({
      delta: 1
    })
  },

  onLoad: function (options) {
    console.log("onLoad " + options)
    this.setData({
      //point: res2.data.point,
      distance: options.distance
    })
  }


})
