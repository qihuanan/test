//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
   showItem: function(event) {
        var that = this;
        var viewId = "D-" + event.currentTarget.dataset.id + "-" + event.currentTarget.dataset.id + "00";
        that.setData({
        viewId: viewId

    });
      console.log(viewId);
  
  },
  
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
