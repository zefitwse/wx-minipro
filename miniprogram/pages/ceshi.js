// pages/ceshi.js
Page({


  data: {

  },

  onLoad: function (options) {

  },
  
  ceshi(){
    wx.cloud.callFunction({
      name:"ceshi"
    })
    .then(res=>{
      console.log("OK")
    })
  }

 

})