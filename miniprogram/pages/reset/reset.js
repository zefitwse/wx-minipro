
var check = require('../../utils/check.js');

var app = getApp(); 
Page({
  data: {
    mobile: '',

    password: '',
    confirmPassword: ''
  },
  


  startReset: function() {
    var that = this;

    if (this.data.mobile.length == 0 ) {
      wx.showModal({
        title: '错误信息',
        content: '手机号和验证码不能为空',
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

    if (this.data.password.length < 3) {
      wx.showModal({
        title: '错误信息',
        content: '用户名和密码不得少于3位',
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

    wx.cloud.callFunction({
      name:"reset",
      data:{
        password:this.data.password,
        mobile:this.data.mobile
      }
    })
    .then(res=>{
      wx.showToast({
        title: '密码重置成功',
       icon:"none",
       duration:1500
      });
      // wx.navigateBack({
      //   delta: 1,
      // })
    })
    .catch(res=>{
      wx.showModal({
        title: '密码重置失败',
        showCancel: false
      });
      console.log(res)
    })
  },
  bindPasswordInput: function(e) {

    this.setData({
      password: e.detail.value
    });
    console.log(this.data.password)
  },
  bindConfirmPasswordInput: function(e) {

    this.setData({
      confirmPassword: e.detail.value
    });
  },
  bindMobileInput: function(e) {
    this.setData({
      mobile: e.detail.value
    });
  },

  clearInput: function(e) {
    switch (e.currentTarget.id) {
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
  
    }
  }
})