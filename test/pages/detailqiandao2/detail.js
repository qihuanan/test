const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    iosDialog1: false,
    unlock: false,
    dakaflag:false,
    photoflag:false,
    cur: 3,
    files: [],
    src: '',
    pictureupres:'',
    cate:'',
    line:{},
    point:{},
    exam: { picture1:''},
    juli: 1,
    inputValue:'',
    verify:"0",// 答案是否对
  },
  //事件处理函数
  bindKeyInput: function (e) {
    console.log('bindKeyInput  ' + JSON.stringify(e))
    this.data.exam.answer.split(';').forEach(v => {
      if (v == e.detail.value) {
        this.setData({
          inputValue: e.detail.value,
          verify: '1',
        })
      }
    })
  }, 
  qiandaoupfile: function () {
    var that = this
    console.log("当uploadFile：" + app.globalData.curupimgsrc)
    wx.uploadFile({
      url: 'https://jd.yousheng.tech/qihntest/wx/upfile', //  
      name: 'imagefile',
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
          url: 'https://jd.yousheng.tech/qihntest/wx/qiandao', //
          header: { 'content-type': 'application/json' },
          data: {
            examid: that.data.exam.id,
            answer: '',
            pointid: app.globalData.curpointid,
            userid: wx.getStorageSync("userid"),
            picture: app.globalData.curupimgsrc
          }, success(res2) {
            console.log("detail qiandao-res  " + JSON.stringify(res2.data))
            if (res2.data.data == 'has') {
              wx.showToast({
                title: '您已签到过此任务点啦，请到下个任务点签到吧！',
                icon: 'none',
                duration: 2000
              })
            }
            if (res2.data.data == 'ok') {
              wx.navigateTo({
                // 1期 提示获取积分
                //url: '/pages/msgsuccess/msg_success?jifen=' + that.data.point.jifen
                // 2期 碎片奖励
                url: '/pages/examsuccess/examsuccess?prizeimg=' + res2.data.pointUserinfo.prizeimg + '&jifen=' + that.data.point.jifen
              })
            }

          }
        })

      },
      fail(res) {
        console.log('uploadFile fail res ' + JSON.stringify(res))
      }
    })
  },
  qiandaosubmit: function(){
    var that = this
    if (that.data.verify != '1'){
      //console.log("qiandaosubmit-verify  " + that.data.verify)
      //wx.navigateTo({
      //  url: '/pages/examfail/examfail'
      //})
      //return;
    }
    wx.request({
      url: 'https://jd.yousheng.tech/qihntest/wx/qiandao', //
      header: { 'content-type': 'application/json' },
      data: {
        examid: that.data.exam.id,
        answer: that.data.inputValue,
        pointid: app.globalData.curpointid,
        userid: wx.getStorageSync("userid"),
        picture: app.globalData.curupimgsrc
      }, success(res2) {
        console.log("detail qiandao-res  " + JSON.stringify(res2.data))
        if (res2.data.data == 'has') {
          wx.showToast({
            title: '您已签到过此任务点啦，请到下个任务点签到吧！',
            icon: 'none',
            duration: 2000
          })
        }
        if (res2.data.data == 'err') {
          wx.navigateTo({
            url: '/pages/examfail/examfail?failmsg=' + that.data.exam.fail
          })
        }
        if (res2.data.data == 'errnochance') {
          wx.showToast({
            title: '答题错误，机会用光了，请到下个任务点吧！',
            icon: 'none',
            duration: 2000
          })
          wx.navigateTo({
            url: '/pages/examfail/examfail?failmsg=' + that.data.exam.fail
          })
        }
        if (res2.data.data == 'ok') {
          wx.navigateTo({
            // 1期 提示获取积分
            //url: '/pages/msgsuccess/msg_success?jifen=' + that.data.point.jifen
            // 2期 碎片奖励
            url: '/pages/examsuccess/examsuccess?prizeimg=' + res2.data.pointUserinfo.prizeimg +'&jifen=' + that.data.point.jifen
          })
        }

      }
    })
  },

  qiandaotap: function (e) {
    console.log('qiandaotap ' + JSON.stringify(e))
    var jingdu = this.data.point.jingdu
    var weidu = this.data.point.weidu
    var juli = this.data.juli
    console.log('qiandaotap-j-weidu: ' + jingdu + " " + weidu)
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log('qiandaotap ' + JSON.stringify(res))
        var distance = that.distance(res.latitude, res.longitude, weidu, jingdu);
        console.log("当前位置距离北京故宫：", distance, "米")
        
        if (parseInt(juli) > parseInt(distance)) {//|| res1 == 1
          console.log("签到距离内：" + app.globalData.curupimgsrc )
          wx.showToast({
            title: '位置验证成功，开始答题任务',
            icon: 'none',
            duration: 2000
          })
          //2期获取 答题信息
          wx.request({
            url: 'https://jd.yousheng.tech/qihntest/wx/exam',
            header: { 'content-type': 'application/json' },
            data: {
              pointid: app.globalData.curpointid,
              userid: wx.getStorageSync("userid")
            }, success(res2) {
              console.log("detail qiandaotap-res  " + JSON.stringify(res2.data))
              that.setData({
                point: res2.data.point,
                cate: res2.data.exam.cate,
                exam: res2.data.exam
              })
              
            }
          })
          
        }else{
          wx.navigateTo({
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
        that.qiandaoupfile()
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
          src: res.tempFilePaths,
        });
        that.qiandaoupfile()
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
      title: '任务点答题'
    })
    var that = this
    wx.request({
      url: 'https://jd.yousheng.tech/qihntest/wx/tiplist', //需要里面的point line   
      header: { 'content-type': 'application/json' },
      data: {
        pointid: app.globalData.curpointid,
        userid: wx.getStorageSync("userid")
      }, success(res2) {
        console.log("detail onLoad-res  " + JSON.stringify(res2.data))
        that.setData({
          point: res2.data.point,
          juli: res2.data.line.qiandaojuli
        })
        that.qiandaotap(options)
      }
    })
    this.setData({
      cur: 3,
    })
    
  },
  onLoad: function (options) {
    console.log("detailqiandao2-onLoad-cate " + options.cate)
    this.setData({
      cate: options.cate,
    })
    console.log("detailqiandao2-onLoad-point " + app.globalData.curpointid)
    
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