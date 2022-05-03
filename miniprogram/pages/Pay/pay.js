let app = getApp();
const db = wx.cloud.database()
Page({
  data: { //页面的初始数据   
    beizhu: "", // 备注信息
 
    cartList: [], // 购物车数据
    totalPrice: 0, //总价
    totalNum: 0, //总数量
    maskFlag: true, // 遮罩
  },
  onLoad() {
    //购物车的数据
    var arr = wx.getStorageSync('cart') || [];
    for (var i in arr) {
      this.data.totalPrice += arr[i].num * arr[i].price;
      this.data.totalNum += arr[i].num
    }
    this.setData({
      cartList: arr,
      totalPrice: this.data.totalPrice.toFixed(2),
      totalNum: this.data.totalNum
    })
  },



  // 获取备注信息
  getRemark(e) {
    this.setData({
      beizhu: e.detail.value
    })
  },
  
  //提交订单
  submitOrder: function (e) {
    console.log("提交了")
    let arr = wx.getStorageSync('cart') || [];
    let arrNew = []
    arr.forEach(item => {
      arrNew.push({
        _id: item._id,
        name: item.foodname,
        price: item.price,
        num: item.num,
        
      })
    });

    db.collection("forder").add({

      data: {
        name: app.globalData.username,
        beizhu: this.data.beizhu,
        totalPrice: this.data.totalPrice, //总价钱
        orderList: arrNew, //存json字符串
        status: 0, //-1订单取消,0新下单待上餐,1待用户评价,2订单已完成
    
        _createTime: new Date().getTime() //创建的时间
      }
    }).then(res => {
      console.log("支付成功", res)
      wx.showToast({
        title: '下单成功！',
      })
      //支付成功后，把购买的菜品销量增加
      wx.cloud.callFunction({
        name: "sales",
        data: {
          id: res._id 
        }
      }).then(res => {
        console.log('添加销量成功', res)
        wx.setStorageSync('cart', "")
        wx.switchTab({
          url: '../mine/mine',
        })
      }).catch(res => {
        console.log('添加销量失败', res)
        wx.showToast({
          icon: 'none',
          title: '支付失败',
        })
      })

    }).catch(res => {
      wx.showToast({
        icon: 'none',
        title: '支付失败',
      })
      console.log("支付失败", res)
    })
  },


})