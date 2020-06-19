//index.js
//获取应用实例
const util = require('../../utils/util.js')
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
    goto: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  goindex: function (e) {
    wx.navigateTo({
      url: "/pages/list/list",
    });
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
    this.setData({
      cur: 5,
      score: wx.getStorageSync("score"),
      hasUserInfo: wx.getStorageSync("hasUserInfo")
    })
  },
  onLoad: function (options) {
    //console.log('qihndebug-options- ' + options)
    console.log('onLoad options ' + JSON.stringify(options))
    if (options && options.goto) { // /pages/detail / detail ? lineid =
      app.globalData.goto = options.goto,
        app.globalData.curlineid = options.lineid
    }
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
                
                if (app.globalData.goto = 'detail' && app.globalData.curlineid !=0){
                  util.navigateTo({
                    url: '/pages/detail/detail?lineid=' + app.globalData.curlineid
                  });
                }else{
                  util.navigateTo({
                    url: "/pages/list/list",
                  });
                }
                
               
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
