const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    
    pointlist: [{
      id:1,
      name:'签到点1',
      jingdu:'33.33',
      weidu: '66.66',
      img: 'url'
    }, {
        id: 1,
        name: '签到点1',
        jingdu: '33.33',
        weidu: '66.66',
        img: 'url'
      }]
    
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function (options){
    wx.setNavigationBarTitle({
      title: '线路名称1'
    })
  },
  onLoad: function (options) {
    console.log("onLoad"+ options.lineid)
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
    
  }
  
  
})
