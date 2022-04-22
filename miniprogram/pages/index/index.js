

Page({
  data: {
  },
  login(){
    wx.getUserProfile({
      desc: '获取您的信息',
    })
    .then(res=>{
      let user=res.userInfo
      console.log(res)
      wx.setStorageSync('user', user)
      wx.reLaunch({
        url: '../mine/mine?name='+user.nickName+"&toux="+user.avatarUrl,
      })
    })
    .catch(err=>{
      console.log(err)
    })
  }
})
