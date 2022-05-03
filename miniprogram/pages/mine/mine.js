var app = getApp();
Page({
  data: {
    username: "未登录",
    orderTicket: {},
    toux:"",
    name:"",
    hasLogin:false

  },
  onLoad: function (res) {
    console.log(app.globalData.hasLogin)
    let user=  wx.getStorageSync('user')
     
      this.setData({
        toux:user.avatarUrl,
        name:user.nickName,
        username:app.globalData.username,
        hasLogin:app.globalData.hasLogin
      })
      console.log(user)
      
  },
  shiming(){
    if(this.data.hasLogin==false){
    wx.navigateTo({
      url: '../userLogin/accountLogin',
    })
  }
  },

  /**跳转到设置界面*/
  goset(){
    wx.navigateTo({ 
      url: '../userinfo/userinfo',
    })
  },
  
  // 跳转到订单界面并绑定数据
  orderTap: function (e) {
    wx.navigateTo({
      url: '../orders/orders',
      success: function (res) {},
      fail: function (res) {
        console.log("fail")
      },
      complete: function (res) {},
    })
  },
  trainorder(){
    wx.switchTab({
      url: '../order/order',
    })
  },
  foodorderTap(){
    wx.navigateTo({
      url: '../foodorder/foodorder',
    })
  },
  admin(){
    wx.navigateTo({
      url: '../admin/admin',
    })
  },
  face(){
    wx.navigateTo({
      url: '../faceEntry/faceEntry',
    })
  }
})