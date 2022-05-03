// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (e, context) => {
  await  cloud.database().collection("order").where({
    username:e.name,
    trainID:e.id,
    date:e.date,
    trainNum:e.trainNum,
  }
  )
    .remove()

  
  return {

  }
}