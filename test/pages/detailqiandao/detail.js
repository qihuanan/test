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
    cur: 3,
    files: [],
    src: '',
    pictureupres:'',
    
    line:{},
    point:{},
    juli: 1
    
  },
  //事件处理函数

  qiandaotap: function (e) {
    console.log('qiandaotap ' + JSON.stringify(e))
    var res1 = e.currentTarget.dataset.res
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var jingdu = this.data.point.jingdu // 
    var weidu = this.data.point.weidu
    var juli = this.data.juli
    console.log('qiandaotap-j-weidu: ' + jingdu + " " + weidu)
    var that = this
    wx.getLocation({
      //type: 'wgs84',
      type: 'gcj02',
      success(res) {
        console.log('qiandaotap ' + JSON.stringify(res))
        var distance = that.distance(res.latitude, res.longitude, weidu, jingdu);
        console.log("当前位置距离北京故宫：", distance, "米")
        
        if (parseInt(juli) > parseInt(distance)) {//|| res1 == 1
          console.log("当uploadFile：" + app.globalData.curupimgsrc )
          wx.uploadFile({
            url: app.globalData.baseurl +'wx/upfile', //  
            name: 'imagefile',
            //url: 'https://jd.yousheng.tech/qihntest/upload', //  
            //name: 'filepath',
            filePath: app.globalData.curupimgsrc,
            header: {
              'Content-Type': 'multipart/form-data'
            },
            formData: {
              'user': 'test'
            },
            success(res) {
              console.log('uploadFile res ' + JSON.stringify(res))
              var resjson = JSON.parse(res.data)
              console.log('uploadFile res2 ' + resjson.data)
              app.globalData.curupimgsrc = resjson.data
              wx.request({
                url: app.globalData.baseurl +'wx/qiandao', //
                header: { 'content-type': 'application/json' },
                data: {
                  code: 1,
                  pointid: app.globalData.curpointid,
                  userid: wx.getStorageSync("userid"),
                  picture: app.globalData.curupimgsrc
                }, success(res2) {
                  console.log("detail qiandao-res  " + JSON.stringify(res2.data))
                  if(res2.data.data == 'has'){
                    wx.showToast({
                      title: '您已签到过此任务点啦，请到下个任务点签到吧！',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                  if (res2.data.data == 'ok') {
                    util.navigateTo({
                      url: '/pages/msgsuccess/msg_success?jifen='+that.data.point.jifen
                    })
                  }
                  
                  that.setData({
                    //point: res2.data.point,
                    hasUserInfo: true
                  })
                }
              })
              
            },
            fail(res){
              console.log('uploadFile fail res ' + JSON.stringify(res))
            }
          })
          
        }else{
          util.navigateTo({
            url: '/pages/msgwarn/msg_warn?distance=' + distance
          })
        }
        
        // if (distance < jingdu){
        //   that.setData({
        //     'curpoint.name': distance+'千米',
        //   })
        // }
        
      },
      fail: () => {
        //不允许打开定位
        wx.showToast({
          title: '获取定位失败，请前往设置打开定位权限',
          icon: 'none',
          duration: 3000
        })
        wx.getSetting({
          success: (res) => {
            if (!res.authSetting['scope.userLocation']) {
              //打开提示框，提示前往设置页面
              wx.showToast({
                title: '获取定位失败，请前往设置打开定位权限',
                icon: 'none',
                duration: 1000
              })
            }
          }
        })
      }

    })
   
  },
  takePhoto(e) {
    var that = this;
    //setTimeout(function(){},1000) 
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        app.globalData.curupimgsrc = res.tempImagePath
        wx.showToast({
          title: '正在验证地址信息！请确保打开GPS定位！',
          icon: 'none',
          duration: 2000
        })
        that.qiandaotap(e)
        this.setData({
          src: res.tempImagePath,
          photoflag: false
        })
      }
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        app.globalData.curupimgsrc = res.tempFilePaths[0]
        console.log("chooseImage-res " + res.tempFilePaths)
        wx.showToast({
          title: '正在验证地址信息！请确保打开GPS定位！',
          icon: 'none',
          duration: 2000
        })
        
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          //files: that.data.files.concat(res.tempFilePaths),
          src:  res.tempFilePaths,
        });
        that.qiandaotap(e)
      }
    })
  },
  bindViewTap: function() {
    util.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function (options){
    wx.setNavigationBarTitle({
      title: '任务点打卡'
    })
    //this.onLoad(options)
    this.setData({
      cur: 3,
    })
  },
  onLoad: function (options) {
    console.log("detailqiandao-onLoad "+ options.lineid)
    console.log("detailqiandao-onLoad-line " + app.globalData.curlineid)
    console.log("detailqiandao-onLoad-point " + app.globalData.curpointid)
    var that = this
    wx.request({
      url: app.globalData.baseurl +'wx/tiplist', // 只需要里面的point   
      header: { 'content-type': 'application/json' },
      data: {
        code: 1,
        pointid: app.globalData.curpointid,
        userid: wx.getStorageSync("userid")
      }, success(res2) {
        console.log("detail onLoad-res  " + JSON.stringify(res2.data))
        that.setData({
          point: res2.data.point,
          juli: res2.data.line.qiandaojuli,
          hasUserInfo: true
        })
      }
    })
  
    
  },

  distance: function (la1, lo1, la2, lo2) { //返回距离(单位千米或公里)
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    
    s = s.toFixed(2);
    s = s * 1000 // 返回米
    return s;
  }
  
  
})