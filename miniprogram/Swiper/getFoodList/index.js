// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.action == 'search' && event.searchKey) { //搜索菜品
    return await db.collection('food').where({
      foodname: db.RegExp({
        regexp: event.searchKey,
        options: 'i'
      }),
      status: '上架'
    }).get()
  }else { //获取100条菜品
    return await db.collection('food')
      .where({
        status: '上架'
      }).get()
  }
}