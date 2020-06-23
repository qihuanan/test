//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    baseurl: app.globalData.baseurl,
    userInfo: {},
    hasUserInfo: false,
    actvielist: [],
    iosDialog1: false,
    verify:'abc',
    verifyinput: 'a',
    curlineid:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShareAppMessage: function () {
  },
  openIOS1: function (e) {
    console.log("detailon openIOS1 " + JSON.stringify(e))
    this.setData({
      iosDialog1: true,
      verifyinput:'',
      curlineid: e.currentTarget.dataset.lineid,
      verify: e.currentTarget.dataset.verify
    })
  },
  close2: function (e) {
    var that = this
    if(this.data.verify == this.data.verifyinput){
      wx.showToast({
        title: '验证码正确，即将跳转...',
        icon: 'none',
        duration: 2000
      })
      wx.navigateTo({
        url: "/pages/detail/detail?lineid=" + that.data.curlineid,
      });
    }else{
      wx.showToast({
        title: '验证码输入错误',
        icon: 'none',
        duration: 2000
      })
    }
    this.setData({
      unlock: true,
      iosDialog1: false,
    })
  },
  bindKeyInput: function (e) {
    console.log('bindKeyInput  ' + JSON.stringify(e))
    this.setData({
      verifyinput: e.detail.value,
    })
  }, 
  islogin: function () {
    var userid = wx.getStorageSync("userid")
    if(userid == null || userid == ''){
      wx.reLaunch({
        url: '/pages/login/login'
      })
    }
  },
  taplike: function (e) {
    console.log('taplike ' + JSON.stringify(e))
    var that = this
    wx.request({
      url: app.globalData.baseurl +'wx/linelike',
      header: { 'content-type': 'application/json' },
      data: {
        lineid: e.target.dataset.lineid,
        userid: wx.getStorageSync("userid")
      }, success(res2) {
        console.log("taplike res  " + JSON.stringify(res2.data.data))
        that.setData({
          ['actvielist[' + e.target.dataset.index+'].like']: res2.data.data,
          hasUserInfo: true
        })
      }
    })

  },
  onShow:function(){
    var userid = wx.getStorageSync("userid")
    console.log("onLaunch userid " + userid)
    if (userid == null || userid == '') {
      //return;
    }
    this.setData({
      cur:1
    })
    var that = this
    wx.request({
      url: app.globalData.baseurl +'wx/getLineList',
      header: { 'content-type': 'application/json' },
      data: {
        code: 1,
        userid: wx.getStorageSync("userid")
      }, success(res2) {
        console.log("login getLineList2 " + JSON.stringify(res2.data.data))
        that.setData({
          actvielist: res2.data.data,
          hasUserInfo: true
        })
      }
    })
  },
  onLoad: function () {
    //this.islogin()
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
