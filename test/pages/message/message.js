const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    listshow: 1,
    toast: false,
    hideToast: false,
    cur: 2,
    list:{},
    mess:'',
    appthis:this
    
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  showmess: function (options){
    var that = this
    that.setData({
      listshow: 0

    })
  },
  
  fabuaction: function (e){
    console.log("fabuaction " + JSON.stringify(e))
    var that = this
    
    wx.request({
      url: 'https://jd.yousheng.tech/qihntest/wx/writeMessage',
      header: { 'content-type': 'application/json' },
      data: {
        description: e.detail.value.evaContent,
        userid: wx.getStorageSync("userid")
      }, success(res2) {
        console.log("fabuaction " + JSON.stringify(res2.data.data))
        that.setData({
          mess: '',
          //listshow: 1
        })
      }
    })
    that.openToast(that) // reLaunch  redirectTo 
    that.getlist(that)
    // wx.redirectTo({
    //   url: `/pages/message/message`
    // })
    // wx.navigateBack({
    //   delta: -1
    // })
  },
  openToast: function (obj) {
    var that = obj
    that.setData({
      toast: true
    });
    setTimeout(() => {
      that.setData({
        hideToast: true
      });
      setTimeout(() => {
        that.setData({
          toast: false,
          hideToast: false,
        });
      }, 300);
    }, 3000);
  },
  onShow: function (options){
    var that = this
    wx.setNavigationBarTitle({
      title: '留言板'
    })
    this.setData({
      cur: 2,
    })
  },
  getlist:function(obj){
    var that = obj
    wx.request({
      url: 'https://jd.yousheng.tech/qihntest/wx/messageList',
      header: { 'content-type': 'application/json' },
      data: {
        code: 1
      }, success(res2) {
        console.log("messagelist " + JSON.stringify(res2.data.data))
        that.setData({
          list: res2.data.data,
          listshow: 1
        })
      }
    })
  },
  onLoad: function (options) {
    console.log("onLoad "+ options)
    var that = this
    this.getlist(that)
   
  }
  
  
})
