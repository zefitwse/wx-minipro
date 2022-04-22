// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(  {env:cloud.DYNAMIC_CURRENT_ENV})

// 云函数入口函数
exports.main = async (e, context) => {


  return await cloud.database().collection("order").add({
    data:{
      seatBit:e.seatBit,
      trainNum:e.trainNum,
      username:e.username,
      // username:"张三",
      startSta:e.start,
      endSta:e.end,
      date:e.date,
      endTime:e.etime,
      startTime:e.stime,
      jideng:e.jideng,
      xiang:e.xiang,
      seat:e.seat,
      trainID:e.id,
    }
   })
}