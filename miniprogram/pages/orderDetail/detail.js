Page({
  data: {
    r: "",
    c: "",
    jixiang:"",
    id:"",
    train:[],
    jideng:""
  },
  onLoad(e) {
    wx.cloud.callFunction({
      name:"gettrain",
      data:{
        id:e.trainid
      }
    })
    .then(res=>{
      this.setData({
        train:res
      })
    })
  
    let seatBit = e.seat
    let xiang = seatBit.slice(3, 7)
    let seat = seatBit.slice(7)
    console.log(xiang, seat)
    // 可以改成云函数
    let xiangarr = xiang.split("")
    console.log(xiangarr)
    let s
    let s2
    let jixiang
    for (let i = 0; i < xiangarr.length; i++) {
      if (xiangarr[i] == "1") {
        s = i
      }
    }
    switch (s) {
      case 0:
        jixiang = "04";
        break;
      case 1:
        jixiang = "03";
        break;
      case 2:
        jixiang = "02";
        break;
      case 3:
        jixiang = "01";
        break;
    }
    console.log(jixiang)
    let seatarr = seat.split("")
    for (let i = 0; i < seatarr.length; i++) {
      if (seatarr[i] == "1") {
        s2 = i
      }
    }

    let a = (seatarr.length) / 3
    let r = parseInt(s2 / a + 1)
    let c = s2 % a + 1
    console.log(a, s2, r, c)
    this.setData({
      r: r,
      c: c,
      jixiang:jixiang,
      id:e.id,
      jideng:e.jideng
    })
  },
  //退票函数
  tuipiao(){
    let e=this.data.train.result.data
    console.log("我是train",this.data.train)
    console.log(this.data.id)
    wx.cloud.callFunction({
      name:"tuipiao",
      data:{
       id:this.data.id 
      }
    })
    .then(res=>{
       wx.cloud.callFunction({
         name:"fuyuan",
         data:{
          trainNum:e.trainNum,
          date:e.date,
          zhan:e.zhan,
          jideng:this.data.jideng,
         }
       })
    })
    .then(res=>{
      wx.navigateBack({
        delta: 1,
      })
    })
  },
  gaiqian(){
    let e=this.data.train.result.data
    console.log("我是train",this.data.train)
    console.log(this.data.id)
    wx.cloud.callFunction({
      name:"tuipiao",
      data:{
       id:this.data.id 
      }
    })
    .then(res=>{
       wx.cloud.callFunction({
         name:"fuyuan",
         data:{
          trainNum:e.trainNum,
          date:e.date,
          zhan:e.zhan,
          jideng:this.data.jideng,
         }
       })
    })
    .then(res=>{
      wx.navigateTo({
        url:"../gaiqian/gaiqian"
      })
    })
  }
})