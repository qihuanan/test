const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    iosDialog1: false,
    unlock: false,
    dakaflag:false,
    photoflag:false,
    files: [],
    src: '',
    curpoint:{id:1,name:'任务点1',desc:'任务描述1', 
      tips:[
        {id:1,tip:'tips1',desc:'tips desc1'},
        { id: 2, tip: 'tips1', desc: 'tips desc1' },
      ]
    },

    markers: [{
      id: 0,  title:'奥林匹克森林公园湿地',
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
        top: 300 - 50,
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
    console.log('markertap ' + JSON.stringify(e) )
    console.log('markertap '+e.markerId)
    var that = this
    that.setData({
      'curpoint.name': e.markerId,
      'curpoint.desc': e.markerId,
      'curpoint.tips[0].tip': e.markerId,
      'curpoint.tips[0].desc': e.markerId,
    })
  },
  controltap(e) {
    console.log('controltap ' +e.controlId)
  },
  
  close: function () {
    this.setData({
      iosDialog1: false,
    })
  },
  close2: function () {
    this.setData({
      unlock: true,
      iosDialog1: false,
    })
  },
  openIOS1: function () {
    this.setData({
      iosDialog1: true
    });
  },
  dakaflagtap: function(){
    this.setData({
      dakaflag: true
    })
  },
  qiandaotap: function (e) {
    console.log('qiandaotap ' + JSON.stringify(e))
    var res1 = e.currentTarget.dataset.res;
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log('qiandaotap ' + JSON.stringify(res))
        var distance = that.distance(res.latitude, res.longitude, 39.918034, 116.415192);
        console.log("当前位置距离北京故宫：", distance, "千米")
        if (res1 == 1){
          wx.navigateTo({
            url: '/pages/msgsuccess/msg_success'
          })
        }else{
          wx.navigateTo({
            url: '/pages/msgwarn/msg_warn'
          })
        }
        
        if (distance<30){
          that.setData({
            'curpoint.name': distance+'千米',
          })
        }
        
      }
    })
   
  },
  takePhoto() {
    
    //setTimeout(function(){},1000)
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
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
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          //files: that.data.files.concat(res.tempFilePaths),
          src:  res.tempFilePaths,
        });
      }
    })
  },
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