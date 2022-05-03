let searchkey=""
Page({
  data:{
    swiperList: [],
  },
onLoad(){
  wx.cloud.callFunction({
    name: 'swiperfun2',
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
getSearch(e){
    searchkey=e.detail.value
    console.log(e.detail.value)
},
sosuo(){
  if(searchkey!=""){
    wx.navigateTo({
      url: '../food/food?searchKey='+searchkey,
    })
  }else{
    wx.showToast({
      title:"搜索为空",
      icon:"none"
    })
    wx.navigateTo({
      url: '../food/food?searchKey='+searchkey,
    })
  }
},
chide(e){
  let a=e.currentTarget.dataset.kind
  console.log(a)
  wx.navigateTo({
    url: '../food/food?kind='+a+"&mode="+"2"
  })
}









})