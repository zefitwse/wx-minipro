const app=getApp()
Page({
  data: {
      user:""
  },

onShow(){
  if(app.globalData.hasLogin==true){
    wx.cloud.database().collection("users").where({
      username:app.globalData.username
     })
     .get()
     .then(res=>{
       this.setData({
         user:res.data
       })
     })
  }
},

exit(){
  console.log("我是user",this.data.user)
  wx.clearStorageSync()
  wx.showToast({
    title: '退出登录成功',
    icon: 'none',
    duration: 2000,
    success: function () {
       setTimeout(function () {
          //跳转到首页，强制重启
          wx.reLaunch({
             url: '/pages/index/index',
          })
       }, 2000);
    }
 })
}

  
})