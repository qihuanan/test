const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    listshow: 1,
    toast: false,
    hideToast: false,
    cur: 2,
    
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
  fabuaction: function (options){
    var that = this
    that.openToast(that)
    that.setData({
      listshow: 1

    })
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
    wx.setNavigationBarTitle({
      title: '留言板'
    })
    this.setData({
      cur: 2,
    })
    
  },
  onLoad: function (options) {
    console.log("onLoad"+ options)
    var that = this
    
  
    
  }
  
  
})
