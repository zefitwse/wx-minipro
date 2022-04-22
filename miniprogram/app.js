// app.js
App({
  onLaunch(){
    wx.cloud.init({
      env:"cloud1-7gy7qesl38f7fd1e"
    })
  },
  
  globalData: {
    userInfo: null,
    hasLogin: false,
    username:'未登录'
  }
})
