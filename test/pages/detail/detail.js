const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    baseurl: app.globalData.baseurl,
    iosDialog1: false,
    unlock: false,
    dakaflag:false,
    photoflag:false,
    files: [],
    src: '',
    line:'',
    
    
  },
  //事件处理函数
  islogin: function () {
    var userid = wx.getStorageSync("userid")
    if (userid == null || userid == '') {
      util.navigateTo({
        url: '/pages/login/login?goto=detail&lineid=' + app.globalData.curlineid
      })
    }
  },
  dakaflagtap: function(e){
    this.islogin()
    var userid = wx.getStorageSync("userid")
    console.log("onLaunch userid " + userid)
    if (userid == null || userid == '') {
      return;
    }
    var that  = this
    var lineid = e.currentTarget.dataset.lineid
    console.log("dakaflagtap par  " + lineid)
    wx.request({ // app.globalData.baseurl
      url: app.globalData.baseurl+'wx/linedaka',
      header: { 'content-type': 'application/json' },
      data: {
        lineid: lineid,
        userid: wx.getStorageSync("userid")
      }, success(res2) {
        console.log("dakaflagtap res  " + JSON.stringify(res2.data.data))
        util.navigateTo({
          url: '/pages/detailon/detail?lineid=' + lineid
        })
      }
    })

    this.setData({
      dakaflag: true
    })
  },

  bindViewTap: function() {
    util.navigateTo({
      url: '../logs/logs'
    })
  },
  onShareAppMessage: function () {
  },
  showimgTap:function(e){
    console.log('showimgTap ' + JSON.stringify(e))
    console.log('showimgTap ' + e.currentTarget.dataset.imgsrc)
    wx.previewImage({
      current: e.currentTarget.dataset.imgsrc,
      urls: [e.currentTarget.dataset.imgsrc]
    })
  },
  taplike: function(e){
    console.log('taplike ' + JSON.stringify(e))
    console.log('curlineid ' + app.globalData.curlineid)
    var that = this
    wx.request({
      url: app.globalData.baseurl +'wx/linelike',
      header: { 'content-type': 'application/json' },
      data: {
        lineid: app.globalData.curlineid,
        userid: wx.getStorageSync("userid")
      }, success(res2) {
        console.log("taplike res  " +res2.data.data)
        console.log("taplike res  " + JSON.stringify(res2.data.data))
        that.setData({
          'line.like': res2.data.data,
          hasUserInfo: true
        })
      }
    })

  },
  onShow: function (options){
    wx.setNavigationBarTitle({
      title: '线路详情'
    })
    var that = this
    wx.request({
      url: app.globalData.baseurl + 'wx/linedetail',
      header: { 'content-type': 'application/json' },
      data: {
        code: 1,
        lineid: app.globalData.curlineid,
        userid: wx.getStorageSync("userid")
      }, success(res2) {
        console.log("detail onShow2 " + app.globalData.curlineid)
        console.log("detail onShow  " + JSON.stringify(res2.data.data))
        //that.actvielist = res2.data.data
        that.setData({
          //line: JSON.stringify(res2.data.data),
          line: res2.data.data,
          hasUserInfo: true
        })
      }
    })
  },
  onLoad: function (options) {
    console.log("onLoad-lineid:"+ options.lineid)
    app.globalData.curlineid = options.lineid
    return 
    var that = this
    wx.request({
      url: app.globalData.baseurl +'wx/linedetail',
      header: { 'content-type': 'application/json' },
      data: {
        code: 1,
        lineid: app.globalData.curlineid,
        userid: wx.getStorageSync("userid")
      }, success(res2) {
        //console.log("login getLineList " + res2.data)
        console.log("detail onLoad  " + JSON.stringify(res2.data.data))
        //that.actvielist = res2.data.data
        that.setData({
          //line: JSON.stringify(res2.data.data),
          line: res2.data.data,
          hasUserInfo: true
        })
      }
    })
    
  },

  
  
  
})
