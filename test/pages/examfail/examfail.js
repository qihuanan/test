const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    cur: 5,
    baseurl: app.globalData.baseurl,
    failmsg:'很遗憾，回答错误'

  },
  //事件处理函数

  gonext: function (e) {
    util.navigateTo({
      url: "/pages/detailon/detail",
    });
    //wx.navigateBack({
    //  delta: 2
    //})
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
