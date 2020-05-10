//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    baseurl: app.globalData.baseurl,
    userInfo: {},
    score:0,
    activelist:{},
    hasUserInfo: false,
    showpanel: 1,
    user:{},
    cur:5,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  todetail: function (e) {
    console.log('markertap ' + JSON.stringify(e))
    console.log('todetail-' + e.currentTarget.dataset.lineid)
    wx.navigateTo({
      url: "/pages/detailon/detail?lineid=" + e.currentTarget.dataset.lineid,
    });
  },
  islogin: function () {
    var userid = wx.getStorageSync("userid")
    if (userid == null || userid == '') {
      wx.reLaunch({
        url: '/pages/login/login'
      })
    }
  },
  showmyactive: function (e){
    console.log(e.currentTarget.dataset.panel)
    this.setData({
      showpanel: e.currentTarget.dataset.panel
    })
  },
  onShow:function(){
    console.log('qihndebug-onShow-1-getStorageSync.score ' + wx.getStorageSync("score") )
    console.log('qihndebug-onShow-1-getStorageSync.hasUserInfo ' + wx.getStorageSync("hasUserInfo"))
    var that = this;
    wx.request({
      url: app.globalData.baseurl +'wx/wode', // 
      header: { 'content-type': 'application/json' },
      data: {
        code: 1,
        userid: wx.getStorageSync("userid")
      }, success(res2) {
        console.log("home onLoad-res  " + JSON.stringify(res2.data))
        app.globalData.score = res2.data.user.score
        wx.setStorageSync("score", app.globalData.score)
        that.setData({
          activelist: res2.data.data,
          user: res2.data.user,
          cur: 5,
          score: wx.getStorageSync("score"),
          hasUserInfo: wx.getStorageSync("hasUserInfo")
        })
      }
    })
    
  },
  onLoad: function (options) {
    this.islogin()
    console.log('qihndebug-options- ' + options)
    var that = this;
    if (app.globalData.userInfo) {
      console.log('qihndebug-1-app.globalData.score ' + app.globalData.score)
      this.setData({
        userInfo: app.globalData.userInfo,
        //score: app.globalData.score,
        hasUserInfo: true
      })
    }else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log('qihndebug-res1 ' + res.userInfo)
        app.globalData.userInfo = res.userInfo
        wx.setStorageSync("hasUserInfo", true)
        console.log('qihndebug-2-app.globalData.score ' + app.globalData.score)
        this.setData({
          userInfo: res.userInfo,
          //score:app.globalData.score,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log('qihndebug-res22 ' + res.userInfo)
          app.globalData.userInfo = res.userInfo
          wx.setStorageSync("hasUserInfo", true)
          console.log('qihndebug-3-app.globalData.score ' + app.globalData.score)
          this.setData({
            userInfo: res.userInfo,
            //score: app.globalData.score,
            hasUserInfo: true
          })
        }
      })
    }

    
    
  },
 
  getUserInfo: function(e) {
    console.log(e)
    var that = this
    app.globalData.userInfo = e.detail.userInfo
    if (wx.getStorageSync("openid")) {
      console.log('qihndebug-openid ' + wx.getStorageSync("openid"))
      console.log('qihndebug-score ' + wx.getStorageSync("score"))
    } else {
      wx.login({
        success(res) {
          if (res.code) {
            wx.request({
              url: app.globalData.baseurl +'wx/login',
              data: {
                code: res.code,
                avatarUrl: app.globalData.userInfo.avatarUrl,
                nickName: app.globalData.userInfo.nickName
              }, success(res2) {
                console.log("login res2 " + JSON.stringify(res2.data.data) )
                wx.setStorageSync("openid", res2.data.data.openid)
                wx.setStorageSync("score", res2.data.data.score)
                wx.setStorageSync("userid", res2.data.data.id)
                app.globalData.score = res2.data.data.score
                console.log('qihndebug-4-app.globalData.score ' + app.globalData.score)
                
                that.setData({

                  score: app.globalData.score

                })
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

  }
})
