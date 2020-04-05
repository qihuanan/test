const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    latitude: 40.018720,
    longitude: 116.384537,
    iosDialog1: false,
    unlock: false,
    dakaflag: false,
    photoflag: false,
    height:600,
    cur: 4,
    files: [],
    src: '',
    curpoint: {
      id: 1, name: '任务点1', desc: '任务描述1',
      tips: [
        { id: 1, tip: 'tips1', desc: 'tips desc1' },
        { id: 2, tip: 'tips1', desc: 'tips desc1' },
      ]
    },

    markers: [{
      id: 0, title: '奥林匹克森林公园湿地',
      latitude: 40.018720, longitude: 116.384537,
      width: 20, height: 20,
      iconPath: "/pages/images/green.jpg",
    }, {
      id: 1,
      title: '奥林匹克森林南园',
      latitude: 40.016062,
      longitude: 116.391505,
      width: 20,
      height: 20, iconPath: "/pages/images/green.jpg",

    }, {
      id: 2,
      title: '奥林匹克森林北园',
      latitude: 40.027594, longitude: 116.391752,
      width: 20, height: 20, iconPath: "/pages/images/green.jpg",

    }, {
      id: 4,
      title: '奥林匹克森林服务中心',
      latitude: 40.024500,
      longitude: 116.398330,
      width: 20,
      height: 20, iconPath: "/pages/images/red.jpg",

    }],
    polyline: [],
    controls: [{
      id: 1,
      iconPath: '/pages/images/location.png',
      position: {
        left: 0,
        top: 600 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],


  },
  //事件处理函数
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log('markertap ' + JSON.stringify(e))
    console.log('markertap ' + e.markerId)
    var that = this
    that.setData({
      'curpoint.name': e.markerId,
      'curpoint.desc': e.markerId,
      'curpoint.tips[0].tip': e.markerId,
      'curpoint.tips[0].desc': e.markerId,
    })
  },
  controltap(e) {
    var that = this
    console.log('controltap ' + e.controlId)
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log('qiandaotap ' + JSON.stringify(res))
        that.setData({
          latitude : res.latitude,
          longitude : res.longitude
        })
      }
    })

  },

  
  onShow: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '线路地图'
    })
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight - res.statusBarHeight;
        let clientWidth = res.windowWidth;
        let ratio = 750 / clientWidth;
        let height1 = clientHeight * ratio;
        //that.data.height = height1.toFixed(0) - 400
        that.setData({
          cur: 4,
          height: (height1.toFixed(0) - 600),
          //'controls[0].position.top': (height1.toFixed(0) - 600)
        })
      }
    })
    console.log("height " + that.data.height)
    
    console.log("height " + that.data.controls[0].position.top)
  },
  onLoad: function (options) {
    console.log("onLoad" + options.lineid)
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

  },


})
