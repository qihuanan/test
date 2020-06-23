const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    baseurl: app.globalData.baseurl,
    longitude: 116.384537,
    latitude: 40.018720,
    scale: 14,
    scalecur: 14,
    iosDialog1: false,
    unlock: false,
    dakaflag:false,
    photoflag:false,
    files: [],
    line: {},
    pointlist:[],
    tipList:[],
    point:{},
    initmarkers:{},
    prepoint:'', // 上次的点击点
    kouchujifen:1,
    tipid:0,
    juli: 1,
    src: '',
    curpoint:{id:1,name:'任务点1',desc:'任务描述1', 
      tips:[
        {id:1,tip:'tips1',desc:'tips desc1'},
      ]
    },

    markers: [{
      id: 0,  title:'奥林匹克森林公园湿地',
      latitude: 40.018720, longitude: 116.384537,
      width: 30, height: 30,
      iconPath: "/pages/images/icon-des-d@2x.png",
    }],
    polyline: [],
    controls: [{
      id: 1, iconPath: '/pages/images/icon_my_location.png', clickable: true,
      position: {left: 10, top: 410 - 50,width: 30, height: 30}
    },{
        id: 2, iconPath: '/pages/images/icon_zoom_out.png', clickable: true,
        position: { left: 45, top: 410 - 50, width: 30, height: 30 }
      }],
    
    
  },
  //事件处理函数 
  regionchange(e) {
    console.log(e.type)
  },
  totask :function(){
    wx.navigateTo({
      url: '/pages/detailqiandao2/detail'
    })
  },
  showimgTap: function (e) {
    console.log('showimgTap ' + JSON.stringify(e))
    console.log('showimgTap ' + e.currentTarget.dataset.imgsrc)
    wx.previewImage({
      current: e.currentTarget.dataset.imgsrc,
      urls: [e.currentTarget.dataset.imgsrc]
    })
  },
  markertap(e) {
    var that = this
    console.log('markertap ' + JSON.stringify(e) )
    console.log('markertap '+e.markerId)
    if(this.data.line.orderflag == '1'){
      if(app.globalData.curpointid != e.markerId){
        e.markerId = app.globalData.curpointid
        wx.showToast({
          title: '顺序限制！请先完成当前签到点！',
          icon: 'none',
          duration: 4000
        })
      }
    }
    app.globalData.curpointid = e.markerId
    console.log('markertap curpointid ' + e.markerId)
    
    var markers = that.data.initmarkers
    for (var i in markers) {
      if (markers[i].iconPath.indexOf("select")) {
        //markers[i].iconPath = "/pages/images/icon-des-d@2x.png"
        markers[i].iconPath = markers[i].iconPath.replace("select","unchecked")
      }
      markers[i].width = "30"
      markers[i].height = "30"
      markers[i].title = ""
    }
    for (var i in markers) {
      if (markers[i].id == that.data.prepoint) {
        //markers[i].iconPath = "/pages/images/icon-des-d@2x.png"
        break;
      }
    }
    for (var i in markers){
      if (markers[i].id == e.markerId){
        //markers[i].iconPath = "/pages/images/icon-flg-ylw@2x.png"
        //markers[i].iconPath = "/pages/images/svg/unchecked/point-unchecked02.svg"
        markers[i].iconPath = markers[i].iconPath.replace("unchecked","select")
        markers[i].width = "40"
        markers[i].height = "40"
        break;
      }
    }
    that.setData({
      markers: markers,
      prepoint: e.markerId
    })
    
    wx.request({
      url: app.globalData.baseurl +'wx/tiplist',
      header: { 'content-type': 'application/json' },
      data: {
        pointid: e.markerId,
        userid: wx.getStorageSync("userid")
      }, success(res2) {
        console.log("markertap res " + JSON.stringify(res2.data))
        that.setData({
          point: res2.data.point,
          unlock:false,
          scale:res2.data.line.qizhidaxiao,
          markers:markers, // 不导致多次重绘
          'line.jingdu': res2.data.point.jingdu,
          'line.weidu': res2.data.point.weidu,
          tipList: res2.data.tipList
        })
      }
    })
    
  },
  controltap(e) {
    var that = this
    console.log('controltap ' + e.controlId)
    if (e.controlId == 1){
      wx.getLocation({
        //type: 'wgs84',
        type: 'gcj02',
        success(res) {
          console.log('controltap-res ' + JSON.stringify(res))
          that.setData({
            scale: that.data.scalecur,
            'point.weidu': res.latitude,
            'point.jingdu': res.longitude
          })
        },
        fail(res) {
          wx.showToast({
            title: '获取定位失败，请前往设置打开定位权限',
            icon: 'none',
            duration: 1000
          })
        }
      })
    }else{
      this.setData({
        scale: that.data.scalecur,
        'point.weidu': that.data.latitude,
        'point.jingdu': that.data.longitude
      })
    }
    
  },
  
  close: function () {
    this.setData({
      iosDialog1: false,
    })
  },
  close2: function (e) { //unlockTip 
    
    var that = this
    console.log("detailon close2 " + that.data.tipid + ' ' + wx.getStorageSync("userid"))
    wx.request({
      url: app.globalData.baseurl +'wx/unlockTip',
      header: { 'content-type': 'application/json' },
      data: {
        tipid: that.data.tipid,
        userid: wx.getStorageSync("userid")
      }, success(res2) {
        console.log("unlockTip " + JSON.stringify(res2.data))
        that.setData({
          mess: '',
          tipList: res2.data.tipList
          //listshow: 1
        })
      }
    })
    this.setData({
      unlock: true,
      iosDialog1: false,
    })
  },
  openIOS1: function (e) {
    console.log("detailon openIOS1 " + JSON.stringify(e))
    var canunlock = e.currentTarget.dataset.canunlock
    if (canunlock != '1'){
      console.log("detailon openIOS1 解锁顺序限制，不可解锁！")
      wx.showToast({
        title: '解锁限制，请您按照顺序解锁！',
        icon: 'none',
        duration: 3000
      })
      return;
    }else{
      this.setData({
        iosDialog1: true,
        kouchujifen: e.currentTarget.dataset.jifen,
        tipid: e.currentTarget.dataset.tipid
      })
    }
    
  },
  dakaflagtap: function(){
    this.setData({
      dakaflag: true
    })
  },
  taplike: function (e) {
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
        console.log("taplike res  " + res2.data.data)
        console.log("taplike res  " + JSON.stringify(res2.data.data))
        that.setData({
          'line.like': res2.data.data,
          hasUserInfo: true
        })
      }
    })

  },
  bindViewTap: function() {
    util.navigateTo({
      url: '../logs/logs'
    })
  },
  verifylocaiton: function () {
    var that = this
    var jingdu = this.data.point.jingdu
    var weidu = this.data.point.weidu
    var juli = this.data.juli
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log('verifylocaiton ' + JSON.stringify(res))
        var distance = that.distance(res.latitude, res.longitude, weidu, jingdu);
        console.log("verifylocaiton当前位置距离北京故宫：", distance, "米")
        if (parseInt(juli) > parseInt(distance)) {//|| res1 == 1
          console.log("verifylocaiton签到距离内：" + app.globalData.curupimgsrc)
          util.navigateTo({ // reLaunch redirectTo
            url: '/pages/detailqiandao2/detail'
          })
        } else {
          util.navigateTo({
            url: '/pages/msgwarn/msg_warn?distance=' + distance
          })
        }
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
  onShow: function (options){
    wx.setNavigationBarTitle({
      title: '线路详情'
    })
    var that = this
    //this.getLineList(that)
    wx.request({
      url: app.globalData.baseurl +'wx/linedetailon',
      header: { 'content-type': 'application/json' },
      data: {
        code: 1,
        lineid: app.globalData.curlineid,
        userid: wx.getStorageSync("userid")
      }, success(res2) {
        console.log("detailon linedetailon  " + JSON.stringify(res2.data))
        //that.actvielist = res2.data.data
        app.globalData.curpointid = res2.data.point.id
        that.setData({
          line: res2.data.line, //parseFloat
          pointlist: res2.data.pointlist,
          tipList: res2.data.tipList,
          point: res2.data.point,
          longitude: res2.data.line.jingdu,
          latitude: res2.data.line.weidu,
          markers: res2.data.marklist,
          initmarkers: res2.data.marklist,
          scale: res2.data.line.ditudaxiao,
          scalecur: res2.data.line.ditudaxiao,
          juli: res2.data.line.qiandaojuli,
          hasUserInfo: true
        })
      }
    })
  },
  onLoad: function (options) {
    console.log("detailon onLoad " + JSON.stringify(options))
    var curlineid = app.globalData.curlineid
    console.log("detailon onLoad-curlineid " + curlineid)
    if (options && options.lineid){
      console.log("detailon onLoad" + options.lineid)
      app.globalData.curlineid = options.lineid
      curlineid = app.globalData.curlineid
      console.log("detailon onLoad-curlineid2 " + curlineid)
    }else{
      //app.globalData.curlineid = 7
    }
    
    
  },

  distance: function (la1, lo1, la2, lo2) { //返回距离(单位千米或公里) 
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    s = s.toFixed(3);
    s = s * 1000 // 返回米
    return s;
  }
  
  
})
/**
 * label: {
        content: '金水区绿地原盛国际',  //文本
        color: '#FF0202',  //文本颜色
        borderRadius: 3,  //边框圆角
        borderWidth: 1,  //边框宽度
        borderColor: '#FF0202',  //边框颜色
        bgColor: '#ffffff',  //背景色
        padding: 5,  //文本边缘留白
        textAlign: 'center'  //文本对齐方式。有效值: left, right, center
      }
 * 
 */