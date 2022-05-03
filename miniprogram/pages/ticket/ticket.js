


Page({
  data: {
    date:"",
    trainList:[],
    winHeight:600,
    currentTab:'1',
    flag:"",
    startStation:"",
    endStation:"",
    xs:"",
    dc:""
  },


  onLoad: function (e) {
    if(e.xs=="1"){
        this.data.flag=true
        this.setData({
          flag:"xs"
        })
    }else if(e.dc=="1"&&e.xs=="0"){
      this.setData({
        flag:"tuan"
      })
    }else{
      this.setData({
        flag:"pt"
      })
    }
    console.log(e)
    var startStation=e.startSta;//始发站
    var endStation=e.endSta;//终点站
    var date=e.date;//日期
    var xs=e.xs;//学生票
    var dc=e.dc;//多乘，团购;
    var both=e.both;
    
    wx.setNavigationBarTitle({
      title: startStation + "-->" + endStation 
    });
    this.setData({
     date:date,
     startStation:e.startSta,
     endStation:e.endSta,
     xs:e.xs,
     dc:e.dc,
      both:e.both,
    });

  },
 
  onShow(){
    let e=this.data
    this.loadTrainsList(e.startStation,e.endStation,e.date,e.xs,e.dc,e.both)
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
     url: '../showTicket/showTicket?id='+e.currentTarget.dataset.id+'&trainNum='+e.currentTarget.dataset.trainnum+"&tuan="+this.data.flag+"&status="+this.data.flag,
   })
  console.log(e.currentTarget.dataset.id)
 }
 
})