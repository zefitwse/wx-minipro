// pages/train/trainList/trainList.js
var util=require('../../utils/util');

Page({
  data: {
    date:"",
    trainList:[],
    winHeight:600,
    currentTab:'1',
  },


  onLoad: function (e) {
    console.log(e)
    var startStation=e.startSta;//始发站
    var endStation=e.endSta;//终点站
    var date=e.date;//日期
    var xs=e.xs;//学生票
    var dc=e.dc;//动车;
    var both=e.both;
    
    wx.setNavigationBarTitle({
      title: startStation + "-->" + endStation 
    });
    this.setData({
     date:date
    });
    this.loadTrainsList(startStation,endStation,date,xs,dc,both);


  },

 
  loadTrainsList:function(startStation,endStation,date,xs,dc,both){
   
    console.log("aa",startStation,date)
    wx.cloud.database().collection("trainList").where({
      //  startSta:startStation,
      //  endSta:endStation,
      //  date:date 
      
    })
    .get()
    .then(res=>{
      this.setData({
        trainList:res.data,
      })
      console.log("成功辣",res.data)
    })
    .catch(err=>{
      console.log(err)
    })
  },
  /**筛选 */
  switchNav:function(e){
    var id=e.currentTarget.id;
    console.log(id);
    this.setData({currentTab:id});
  },

  /**跳转到时间选择界面 */
  selectTime:function(e){
      wx.navigateTo({
        url: '../showdate/index',
        success: function(res) {
          console.log("success")
        },
        fail: function(res) {
          console.log("fail")
        },
        
      })
  },
 goDetail(e){
  console.log("我是e",e)
   wx.navigateTo({
     url: '../showTicket/showTicket?id='+e.currentTarget.dataset.id+'&trainNum='+e.currentTarget.dataset.trainnum,
   })
  console.log(e.currentTarget.dataset.id)
 }
 
})