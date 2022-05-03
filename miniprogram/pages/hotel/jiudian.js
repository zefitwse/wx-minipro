// pages/hotel/jiudian.js
Page({

  data: {
   beijing:[]
  },

  onLoad: function (options) {
     
  },
 jiu1(e){
  console.log(e)
   wx.navigateTo({
     url: '../out/out?src='+e.currentTarget.dataset.src,
   })
 }
})