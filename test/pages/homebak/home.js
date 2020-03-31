//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    score:100,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow:function(){
    console.log('qihndebug-onShow-1-getStorageSync.score ' + wx.getStorageSync("score") )
    this.setData({
      score: wx.getStorageSync("score")
    })
  },
  onLoad: function (options) {
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
          console.log('qihndebug-res2 ' + res.userInfo)
          app.globalData.userInfo = res.userInfo
        
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
              url: 'https://jd.yousheng.tech/qihntest/wx/login',
              data: {
                code: res.code,
                avatarUrl: app.globalData.userInfo.avatarUrl,
                nickName: app.globalData.userInfo.nickName
              }, success(res2) {
                console.log("login res2 " + res2.data)
                wx.setStorageSync("openid", res2.data.openid)
                wx.setStorageSync("score", res2.data.score)
                app.globalData.score = res2.data.score
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
