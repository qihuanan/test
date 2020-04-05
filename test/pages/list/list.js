//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    actvielist: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow:function(){
    this.setData({
      cur:1
    })
  },
  onLoad: function () {
    var that = this
    //this.getLineList(that)
    wx.request({
      url: 'https://jd.yousheng.tech/qihntest/wx/getLineList',
      header: { 'content-type': 'application/json' },
      data: {
        code: 1
      }, success(res2) {
        console.log("login getLineList " + res2.data)
        console.log("login getLineList2 " + res2.data.data)
        //that.actvielist = res2.data.data
        that.setData({
          actvielist: res2.data.data,
          hasUserInfo: true
        })
      }
    })
    
  },
  getLineList: function(obj){
  },
  todetail: function(e){
    console.log('todetail-'+ e.target.dataset.lineid)
    wx.navigateTo({
      url: "/pages/detail/detail?lineid=" + e.target.dataset.lineid,
    });
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
