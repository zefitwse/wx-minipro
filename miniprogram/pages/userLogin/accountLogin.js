// var api = require('../../../config/api.js');
// var util = require('../../../utils/util.js');
// var user = require('../../../utils/user.js');

var app = getApp();
Page({
  data: {
    username: '',
    password: '',
    code: '',
    // loginErrorCount: 0
  },
  accountLogin: function () {
    let username = this.data.username;
    let password = this.data.password;
    if (this.data.password.length < 1 || this.data.username.length < 1) {
      wx.showModal({
        title: '错误信息',
        content: '请输入用户名和密码',
        showCancel: false
      });
      return false;
    }
    wx.cloud.database().collection("users").where({
        username: username
      })
     .get({
       success(res){
          console.log("获取用户成功",res)
          if(password==res.data[0].password){
            console.log("登录成功")
            wx.showToast({
              title: '登陆成功',
            });
            var gloUsername=app.globalData;
            gloUsername.username=res.data[0].username;
            app.globalData.hasLogin=true
            wx.reLaunch({
              url: '../../pages/mine/mine'
            })
          }else{
            wx.showToast({
              title: "密码用户名错误",
              icon:"none"
            })
          }
       },
       fail(err){
          console.log(err)
       }
     })
    
  },
  bindUsernameInput: function (e) {

    this.setData({
      username: e.detail.value
    });
  },
  bindPasswordInput: function (e) {

    this.setData({
      password: e.detail.value
    });
  },
  bindCodeInput: function (e) {

    this.setData({
      code: e.detail.value
    });
  },
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-username':
        this.setData({
          username: ''
        });
        break;
      case 'clear-password':
        this.setData({
          password: ''
        });
        break;
      case 'clear-code':
        this.setData({
          code: ''
        });
        break;
    }
  }
})