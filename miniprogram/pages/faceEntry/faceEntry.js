let app=getApp()
Page({
  data: {
    src: '',
    base64: "",
    baidutoken: "",
    msg: null
  },
  onLoad(){
    if(app.globalData.hasLogin==false){
      wx.showModal({
        title:"未登录",
        success:function (res) {
          if(res.confirm){
            wx.navigateTo({
              url: '../userLogin/accountLogin',
            })
          }else{
            wx.switchTab({
              url: '../mine/mine',
            })
          }
        }
      })
    }
  },
  //拍照并编码
  takePhoto() {
    if(app.globalData.hasLogin==false){
      wx.showToast({
        title: '请登录',
        duration:3000,
        icon:"none"
      })
      wx.navigateTo({
        url: '../userLogin/accountLogin',
      })

    }else{
    var that = this;
    //拍照
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        that.setData({
          src: res.tempImagePath
        })
        console.log("第一次拍摄",res)
        //图片base64编码
        wx.getFileSystemManager().readFile({
          filePath: that.data.src, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调          
            console.log("回调成功",res)
            that.setData({
              base64: res.data
            })
            that.checkPhoto();
          }
        })
      },
      fail:(res)=>{
        console.log(res)
      }
    })

  }
  },
  error(e) {
    console.log(e.detail)
  },
  checkPhoto() {
    var that = this;
    //acess_token获取
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token', //真实的接口地址
      data: {
        grant_type: 'client_credentials',
        client_id: 'S9gZBvoKn4FBUkzQVfo8GV8t', //用你创建的应用的API Key
        client_secret: 'GZnKO5bbsqzGr37fjhCY8VeLVx1NPB8W' //用你创建的应用的Secret Key
      },
      header: {
        'Content-Type': 'application/json' // 默认值
      },
      success(res) {
        console.log("check成功",res)
        that.setData({
          baidutoken: res.data.access_token //获取到token
        })
        that.validPhoto();
      }
    })
  },
  validPhoto() {
    var that = this;
    //上传人脸进行 比对
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=' + that.data.baidutoken,
      method: 'POST',
      data: {
        image: this.data.base64,
        image_type: 'BASE64',
        group_id_list: app.globalData.username, //自己建的用户组id
      },
      header: {
        'Content-Type': 'application/json' // 默认值
      },
      success(res) {
        console.log("valid",res)
        that.setData({
          // msg: res.data.result.user_list[0].score
          msg: res.data.error_msg
        })

        //做成功判断
        if (that.data.msg == "pic not has face") {
          wx.showToast({
            title: '未捕获到人脸',
            icon: 'error',
          })
        }
        if (that.data.msg == 'SUCCESS') {
          if(res.data.result.user_list[0].score>80){
            wx.showToast({
              title: '人脸识别成功',
              icon: 'success',
              duration:1500
            })
            setTimeout(function(){ wx.switchTab({
              url: '../mine/mine',
            })},2500)
           
          }else{
            wx.showToast({
              title: '人脸识别失败',
              icon: 'error',
            })
          }
        }
      }
    });
  }
})
