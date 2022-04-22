// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(  {env:cloud.DYNAMIC_CURRENT_ENV})

// 云函数入口函数
exports.main = async (event, context) => {
  for(let i=0;i<3;i++){
    await cloud.database().collection("G2575").add({
      seat:"1"
    })
  }

  return {

}
}