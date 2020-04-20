const app = getApp()
Page({
  data: {
    cur:5,
   
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
    
  },

})
