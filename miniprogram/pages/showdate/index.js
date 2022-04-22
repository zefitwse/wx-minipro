//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    M:"",
    D:""
  },
  //事件
  onChange(e){
    console.log(e,"页面的事件")
    let { startTime, endTime, selectedDate} = e.detail
    if (selectedDate){
      wx.showToast({
        title: `选择时间:${selectedDate.date}`,
        maskt: true,
        duration: 3000,
        icon: "none"
      })
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var day=e.detail.selectedDate.date.substr(5,9)

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
     date:day
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  onLoad: function () {
    
  }
 
})
