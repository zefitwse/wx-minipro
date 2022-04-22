var app = getApp();
Page({
  data: {
    orderTicket:{},
  },
onShow:function () {
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
  else{
      wx.cloud.callFunction({
        name:"confirmOrder2"
      })
      // .where({
      //   username:"zhangsan"
      // })
      .then(res=>{
        console.log("拿到的数据",res.result.data)
        this.setData({
          orderTicket:res.result.data
        })
      })
    
  }
},
//   onLoad: function () {
//     if(app.globalData.hasLogin==true){
//     wx.cloud.callFunction({
//       name:"confirmOrder2"
//     })
//     // .where({
//     //   username:"zhangsan"
//     // })
//     .then(res=>{
//       console.log("拿到的数据",res.result.data)
//       this.setData({
//         orderTicket:res.result.data
//       })
//     })
//   }
// },
  check(e){
    console.log("check",e.currentTarget.dataset)
  
    wx.navigateTo({
      url: '../orderDetail/detail?seat='+e.currentTarget.dataset.seatbit+"&id="+e.currentTarget.dataset.id+"&trainid="+e.currentTarget.dataset.trainid+"&jideng="+e.currentTarget.dataset.jideng,
    })
  },

})