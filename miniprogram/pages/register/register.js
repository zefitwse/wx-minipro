// var api = require('../../../config/api.js');
var check = require('../../utils/check.js');
var app = getApp();
const db = wx.cloud.database()
const admin = db.collection("users");
Page({
  data: {
    username: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    userID: ''
  },
  //发送验证码。。。已被删除

  //查询注册
  // requestRegister: function(wxCode) {
  //   let that = this;
  //   wx.request({
  //     url: api.AuthRegister,
  //     data: {
  //       username: that.data.username,
  //       password: that.data.password,
  //       mobile: that.data.mobile,
  //       userID: that.data.userID,
  //       wxCode: wxCode
  //     },
  //     method: 'POST',
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success: function(res) {
  //       if (res.data.errno == 0) {
  //         app.globalData.hasLogin = true;
  //         wx.setStorageSync('userInfo', res.data.data.userInfo);
  //         wx.setStorage({
  //           key: "token",
  //           data: res.data.data.token,
  //           success: function() {
  //             wx.switchTab({
  //               url: '../home/home'
  //             });
  //           }
  //         });
  //       } else {
  //         wx.showModal({
  //           title: '错误信息',
  //           content: res.data.errmsg,
  //           showCancel: false
  //         });
  //       }
  //     }
  //   });
  // },

  //开始注册
  startRegister: function () {
    let userID = this.data.userID;
 
    let that=this;
    let flag = false;
    if (this.data.password.length < 6 || this.data.username.length < 6) {
      wx.showModal({
        title: '错误信息',
        content: '用户名和密码不得少于6位',
        showCancel: false
      });
      return false;
    }

    if (this.data.password != this.data.confirmPassword) {
      wx.showModal({
        title: '错误信息',
        content: '确认密码不一致',
        showCancel: false
      });
      return false;
    }

    if (this.data.mobile.length == 0 || this.data.userID.length == 0) {
      wx.showModal({
        title: '错误信息',
        content: '手机号或者身份证不能为空',
        showCancel: false
      });
      return false;
    }

    if (!check.isValidPhone(this.data.mobile)) {
      wx.showModal({
        title: '错误信息',
        content: '手机号输入不正确',
        showCancel: false
      });
      return false;
    }
    if (!check.isValidId(this.data.userID)) {
      wx.showModal({
        title: '错误信息',
        content: '身份找输入不正确',
        showCancel: false
      });
      return false;
    }
    
    admin.get({
      success: (res) => {
        let admins = res.data; //获取到的对象数组数据
        console.log(admins);
        for (let i = 0; i < admins.length; i++) { 
          //遍历数据库对象集合
        
          if (userID === admins[i].userID) { //用户名存在
            console.log("1")
            flag = true;
            // break;
          }
        }
        if (flag === true) { //已注册
          wx.showToast({
            title: '账号已注册！',
            icon: 'none',
            duration: 2500
          })
        } else { //未注册
          console.log("未注册")
          that.saveInfo()
        }
      }
    })
 // wx.login({
    //   success: function(res) {
    //     if (!res.code) {
    //       wx.showModal({
    //         title: '错误信息',
    //         content: '注册失败',
    //         showCancel: false
    //       });
    //     }
    //     that.requestRegister(res.code);
    //   }
    // });

   
  },
  saveInfo:function () {
    let username = this.data.username;
    let password = this.data.password;
    let mobile = this.data.mobile;
    let userID = this.data.userID;
    wx.cloud.database().collection("users").add({
      data: {
        username: username,
        password: password,
        mobile: mobile,
        userID: userID
      }
    })
    .then(res => {
      console.log("success")
      wx.showModal({
        title: '成功',
        content: '注册成功',
        showCancel: false
      })
      setTimeout(this.go
        , 3000)
    })
    .catch(err => {
      console.log(err),
        wx.showModal({
          title: '错误信息',
          content: '注册失败',
          showCancel: false
        })
    })
  },
  //绑定输入事件

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
  bindConfirmPasswordInput: function (e) {

    this.setData({
      confirmPassword: e.detail.value
    });
  },
  bindMobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    });
  },
  bindCodeInput: function (e) {
    this.setData({
      userID: e.detail.value
    })
  },
  //小叉号
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
      case 'clear-confirm-password':
        this.setData({
          confirmPassword: ''
        });
        break;
      case 'clear-mobile':
        this.setData({
          mobile: ''
        });
        break;
      case 'clear-code':
        this.setData({
          userID: ''
        });
        break;
    }
  },
  go(){
    wx.reLaunch({
      url: '../mine/mine?username='+app.globalData.username
    })
  }
})