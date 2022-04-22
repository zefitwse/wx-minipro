// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (e, context) => {


  return await cloud.database().collection("trainList")
  .doc(e.id)
  .get()
  }
