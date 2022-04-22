var dateTime = require("../../utils/util.js");

Page({
  data: {
    swiperList: [],
    date: new Date(),
    start:"出发站",
    end:"目的站",
    xs:"0",
    dc:"0",
    both:"0"
  },
  //获取动车或者学生票或者两个都选
 checkboxChange(e){
  if(e.detail.value.includes("xs")){
    this.setData({
      xs:"1"
    })
  }else{
    this.setData({
      xs:"0"
    })
  }
  if(e.detail.value.includes("dc")){
    this.setData({
      dc:"1"
    })
  }else{
    this.setData({
      dc:"0"
    })
  }
  if(e.detail.value.length===2){
    this.setData({
      both:"1"
    })

  }   else{
    this.setData({
      both:"0"
    })
  }
 },

  onLoad() {
    
    // 设置当前日期为默认日期
    var date = new Date();
    var yueri=dateTime.formatMonth(date);
    this.setData({
      date:yueri
    })
    //轮播图云函数
    wx.cloud.callFunction({
        name: 'swiperfun',
      })
      .then(res => {
        console.log("成功", res),
          this.setData({
            swiperList: res.result.data
          })
      })
      .catch(res => {
        console.log("失败")
      });
  },
  //选择日期处理函数
  toDate() {
    wx.navigateTo({
      url: "../showdate/index",
    })
  },
  homeSta(){
    wx.navigateTo({
      url: '../switchcity/switchcity',
    })
  },
  arrSta(){
    wx.navigateTo({
      url: '../switchcity2/switchcity2',
    })
  },
  change(){
      this.setData({
        start:this.data.end,
        end:this.data.start
      })
  },
  //发给服务器，服务器将数据送给ticket页面
  formSubmit:function(e){
   
    var startStation=e.detail.value.startStation;//始发站
    var endStation=e.detail.value.endStation;//终点站
    var date=e.detail.value.date;//日期：2月2日
    var xs=this.data.xs;
    var dc=this.data.dc;
    var both=this.data.both;
  
    console.log("444",e,xs,dc,both);
    wx.navigateTo({
      url: '../ticket/ticket?startSta=' + startStation + "&endSta=" + endStation + "&date=" + date + "&xs="+xs + "&dc=" + dc + "&both=" + both,
    })
  },
})