const app = getApp()
Page({
  data: {
    cur: 5,
    baseurl: 'https://tycaching.cn/qihntest/',
    failmsg:'很遗憾，回答错误'

  },
  //事件处理函数

  gonext: function (e) {
    wx.navigateBack({
      delta: 0
    })
  },

  onShow: function () {

  },
  onLoad: function (options) {
    console.log('qihndebug-options- ' + options)
    var that = this;
    that.setData({
      failmsg: options.failmsg
    })
  },

})
