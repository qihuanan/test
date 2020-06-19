const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    cur:5,
    prizeimg:'',
    baseurl: app.globalData.baseurl,
    success:'',
    jifen:''
  },
  //事件处理函数
  
  gonext: function (e) { //redirectTo navigateTo 
  // pages/detailqiandao2/detail /pages/detailon/detail
    util.navigateTo({
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
