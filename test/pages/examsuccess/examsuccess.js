const app = getApp()
Page({
  data: {
    cur:5,
    prizeimg:'',
    baseurl: 'https://tycaching.cn/qihntest/',
    success:'',
    jifen:''
  },
  //事件处理函数
  
  gonext: function (e) {
    wx.navigateTo({
      url: "/pages/detailon/detail",
    });
  },

  onShow:function(){
    
  },
  onLoad: function (options) {
    console.log('qihndebug-options- ' + options)
    var that = this;
    that.setData({
      prizeimg: options.prizeimg,
      success: options.success,
      jifen: options.jifen
    })
  },

})
