var app = getApp();
Page({
  data: {
    price: "50",
    trainList: [],
    bit: [],   //order表里的内容
    index: "", //几等座
    index2: "", //a-e座位号
    flagd: "",
    flagb: '',
    id: "",
    thisid:"",
    thisjideng:"",
    etrainNum:"",
    ezhan:'',
    edate:""
  },

  onLoad: function (e) {
    console.log("realgai",e)
    this.setData({
        ezhan:e.ezhan,
        etrainNum:e.etrainNum,
        edate:e.edate,
        thisid:e.thisid,
        thisjideng:e.thisjideng
    })
    console.log("我是e",e)
    //获取从ticket界面拿到的票
    wx.cloud.database().collection("trainList").where({
        _id: e.id
      })
      .get()
      .then(res => {
        this.setData({
          trainList: res.data,
          id: e.id
        })
      })
      //查询订单，以用于在生成seatbit的时候验证还有余票否
      wx.cloud.callFunction({
        name: "confirmOrder",
        data:{
          trainNum:e.trainNum
        }
      })
      .then(res => {
        console.log(res)
        this.setData({
          bit: res.result.data
        })
        console.log(this.data.bit)
      })
  },
  //商务座
  changeCol(e) {
    this.setData({
      index: e.currentTarget.dataset.index,
      flagb: "none",
      flagd: "none"
    })
  },
  //一等座
  changeCol3(e) {
    this.setData({
      index: e.currentTarget.dataset.index,
      flagb: "",
      flagd: "none"
    })
  },
  //二等座
  changeCol4(e) {
    this.setData({
      index: e.currentTarget.dataset.index,
      flagb: "",
      flagd: ""
    })
  },
  changeCol2(e) {
    this.setData({
      index2: e.currentTarget.dataset.index
    })
  },
  //下一步,提交订单
  submit(E) {

    console.log("E",E)
     //余票绑定E，一起送进来
    const e = E.currentTarget.dataset
//获取你买的票的参数
    const tl = this.data.trainList[0]
    var start = tl.startSta
    var end = tl.endSta
    var num = tl.trainNum
    let date=tl.date
    let stime=tl.startTime
    let etime=tl.endTime
//获取你选择的几等座和几号座位
    let index = e.index
    let index2 = e.index2
    let seatBit = ""

    let ss = this.random(2, 3)
    let r = this.random(1, 3)

    let flag = false

    //将order里的记录送到a
    let a = this.data.bit

    //
    let a2=[]

    //生成bitseat
    let f1 = 0
    let f2 = 0

    let o=0
    let mp=0 //表示各种几等座的满票数量

  for(let i=0;i<a.length;i++){
//将order里面和你选的几等座一样的放入a2数组，
  if((a[i].jideng)==index){
          a2[o]=a[i];
          o++;
        }
   }
   console.log("我是a2",a2,"我是a",a)
//xiang3是每种座的车厢个数
    let xiang3=""
    if(index=="特"||index=="1") xiang3=="1";
    else{xiang3=="2"} 

    // 如果你选的车厢里面一张没卖，则直接生成并加入数据库
    if (a2.length == 0) {
      console.log("我是空order")
      
      seatBit = this.makeBit(start, end, index, index2, ss, r)
      console.log("我是空order的seatbit",seatBit)
      let xiang44
      let seat44
      let zhan44
      zhan44=seatBit.slice(0,3)
      let  zhan4=parseInt(zhan44)
        xiang44=seatBit.slice(3,7)
        seat44=seatBit.substring(7)
        wx.cloud.callFunction({
          name: "sendOrd",
          data: {
            seat:seat44,
            xiang:xiang44,
            seatBit: seatBit,
            trainNum: num,
            username: app.globalData.username,
            // username:"张三",
            jideng: index,
            date:date,
            stime:stime,
            etime:etime,
            start:start,
            end:end,
            id:e.id
          }
        })
        .then(
          wx.cloud.callFunction({
            name:"yupiao",
            data:{
              trainNum:num,
              date:date,
              zhan:zhan4,
              jideng:index,
            }
          }),
          console.log("余票执行1")
        )
        //改好之后，再删掉原来的订单
        .then(res=>{
          console.log("执行退票1")
          wx.cloud.callFunction({
            name:"tuipiao",
            data:{
             id:this.data.thisid 
            }
          })
        })
          .then(res=>{
            console.log("执行复原1")
             wx.cloud.callFunction({
               name:"fuyuan",
               data:{
                trainNum:this.data.etrainNum,
                date:this.data.edate,
                zhan:this.data.ezhan,
                jideng:this.data.thisjideng,
               }
             })
          })
        //然后跳转订单
        .then(res => {
          wx.reLaunch({
            url: '../order/order',
          })
        })
    } else if (a2.length != mp) {
      //生成随机seatbit，
      for (let k = 0; k < 50; k++) {
        if (f2 != a2.length) {
          f1 = 0
          f2 = 0
          let ss = this.random(2, 3)
          let r = this.random(1, 3)
          seatBit = this.makeBit(start, end, index, index2, ss, r)
          console.log("我是生成的随机seatBIT", seatBit)
          //和订单里的seatbit比较 
          for (let i = 0; i < a2.length; i++) {
            if (a2[i].seatBit == seatBit) {
              f1++
              console.log("f1", f1)
            } else {
              f2++ //f2=2时，则seatBit没问题
              console.log("f2", f2)
            }
          }
        } else {
          //flag=true表示生成了符合要求的seatbit
          flag = true
          break;
        }
      }

    //sendorder 云函数
      if (flag == true) {
        console.log("我有order的seatbit",seatBit)
    // 用来向与函数发送bit
    let xiang44
    let seat44
    
    let zhan44
    zhan44=seatBit.slice(0,3)
    let  zhan4=parseInt(zhan44)
      xiang44=seatBit.slice(3,7)
      seat44=seatBit.substring(7)
    // }
        wx.cloud.callFunction({
            name: "sendOrd",
            data: {
              seat:seat44,
              xiang:xiang44,
              seatBit: seatBit,
              trainNum: num,  //
              username: app.globalData.username,
              // username:"张三",//
              jideng: index,//
              date:date,//
              stime:stime,//
              etime:etime,//
              start:start,//
              end:end,//
              id:e.id
            }
          })
          .then(
            wx.cloud.callFunction({
              name:"yupiao",
              data:{
                trainNum:num,
                date:date,
                zhan:zhan4,
                jideng:index,
              }
            }),
            console.log("余票执行2","我是zhan44",zhan44)
          )
          .then(res=>{
            wx.cloud.callFunction({
              name:"tuipiao",
              data:{
               id:this.data.thisid 
              }
            })
          })
            .then(res=>{
               wx.cloud.callFunction({
                 name:"fuyuan",
                 data:{
                  trainNum:this.data.etrainNum,
                  date:this.data.edate,
                  zhan:this.data.ezhan,
                  jideng:this.data.thisjideng,
                 }
               })
            })
          .then(res => {
            wx.reLaunch({
              url: '../order/order',
            })
          })
      } else {
        wx.showModal({
          content:"你选的席位无票，请换个选择"
        })
        console.log("你选的席位无票，请换个选择")
        return 0
      }
    } else {
      wx.showModal({
        content:"你选的席位无票，请换个选择"
      })
      console.log("你选的席位无票，请换个选择")
    }
  },
  //生成bit函数
  makeBit(start, end, index, index2, ss, r) { 
    let xiang = "0000"; // 车箱号 商务 一等 和2bit的二等
    let flag1 = 0        //将acbdef转为数字，方便计算seatbit
    let seat2 = "0"
    let indexts=0 // 将特等 ，1，2 转为对应的数字 

    // 如果是特等
    if (index == "特") {
      indexts=0
      xiang = "0001"
       
      switch (index2) {
        case "a":
          flag1 = 1;
          break;
        case "c":
          flag1 = 2;
          break;
        case "f":
          flag1 = 3;
          break;
      }
    }
    // 如果是一等
    if (index == "1") {
      indexts=1
      xiang = "0010"
       
      switch (index2) {
        case "a":
          flag1 = 1;
          break;
        case "b":
          flag1 = 2;
          break;
        case "c":
          flag1 = 3;
          break;
        case "f":
          flag1 = 4;
          break;
      }
    }
    // 如果是二等
    if (index == "2") {  
      indexts=2
      let xiangarr = [0, 0, 0, 0]
      xiangarr[ss - 2] = 1 
      let xiang1 = xiangarr.join("")
      xiang = xiang1
      switch (index2) { 
        case "a":    
          flag1 = 1;         
          break;
        case "b":            
          flag1 = 2;
          break;
        case "c":
          flag1 = 3;
          break;
        case "d":
          flag1 = 4;
          break;
        case "f":
          flag1 = 5;
          break;
      }
    }
    //根据几排几列确定对应位数bit的座位号
    var s = parseInt((indexts * 1 + 3) * (r * 1 - 1) + flag1 * 1 - 1) 
    //先让seat全部为0
    for (let i = 0; i < (indexts+3) * 3 - 1; i++) {
      seat2 += "0"
    }
    let seatarr = seat2.split("")
    //再把用户选中的那一位变为1
    seatarr[s] = "1"
    seat2 = seatarr.join("")

  //生成3bit的站号 
    let zhan = "000" 
    if (start == "宿迁市" && end == "盐城市") {
      zhan = "111"
    }
    if (start == "宿迁市" && end == "泗阳") {
      zhan = "110"
    }
    if (start == "泗阳" && end == "盐城市") {
      zhan = "011"
    }

    let bit = zhan + xiang + seat2
    return bit;
  },
  //生成随机数函数
  random(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
  },

})