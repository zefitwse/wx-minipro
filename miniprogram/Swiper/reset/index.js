// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init( { env: cloud.DYNAMIC_CURRENT_ENV})

// 云函数入口函数
exports.main = async (e, context) => {
  await cloud.database().collection("users").where({
    mobile:e.mobile
  })
  .update({
    data:{
      password:e.password
    }
  })

  return {
    o:"ok"
  }
}