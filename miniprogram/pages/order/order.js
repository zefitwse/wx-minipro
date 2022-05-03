var app = getApp();
let orderStatus = "未出行"; 
Page({
  data: {
    orderTicket:{},
    navbar: ["未出行",  "已完成"],
  },
  navbarTap: function (e) {
    let index = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: index
    })
    if (index == 0) {
      orderStatus = "未出行";
    } else if (index == 1) {
      orderStatus = "已完成";
    } else {
      orderStatus = "未出行";
    }
    this.showpage()
  },
onShow:function () {
  this.showpage()
},
showpage(){
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
        name:"confirmOrder2",
        data:{
          status:orderStatus,
          username:app.globalData.username
        }
      })
    
      .then(res=>{
        console.log("拿到的数据",res.result.data)
        this.setData({
          orderTicket:res.result.data
        })
      })
    
  }
},

  check(e){
    console.log("check",e.currentTarget.dataset)
  
    wx.navigateTo({
      url: '../orderDetail/detail?seat='+e.currentTarget.dataset.seatbit+"&id="+e.currentTarget.dataset.id+"&trainid="+e.currentTarget.dataset.trainid+"&jideng="+e.currentTarget.dataset.jideng,
    })
  },

})