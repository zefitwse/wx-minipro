//JS
var app = getApp()
let orderStatus = 0; //-1订单取消,0新下单待上餐,1待用户评价,2订单已完成
let db = wx.cloud.database();
Page({
  data: {
    // 顶部菜单切换
    navbar: ["待上餐", "已完成", "已取消"],
    // 默认选中菜单
    currentTab: 0,

    list: []
  },
  //顶部tab切换
  navbarTap: function (e) {
    let index = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: index
    })
    if (index == 0) {
      orderStatus = 0;
    } else if (index == 1) {
      orderStatus = 2;
    } else if (index == 2) {
      orderStatus = -1;
    }  else {
      orderStatus = 0;
    }
    this.getMyOrderList();
  },

  onShow: function () {
    this.getMyOrderList();
  },

  getMyOrderList() {
    let openid = app._checkOpenid();
    if (!openid) {
      return;
    }
    wx.cloud.callFunction({
        name: 'getOrderList',
        data: {
          action: 'user',
          orderStatus: orderStatus,
          name:app.globalData.username
        }
      })
      .then(res => {
        console.log("我的订单列表", res)
        this.setData({
          list: res.result.data
        })
      }).catch(res => {
        console.log("我的订单列表失败", res)
      })
  },
  //去评论页面
 

  //取消订单
  cancleOrder(event) {
    /**
     * 如果允许用户随意取消订单，就把下面注释解开
     */
    // let orderId = event.currentTarget.dataset.orderid;
    // db.collection('order').doc(orderId).update({
    //   data: {
    //     status: -1
    //   }
    // }).then(res => {
    //   console.log('取消订单成功', res)
    //   this.getMyOrderList()
    // }).catch(res => {
    //   console.log('取消订单失败', res)
    // })
    // return

    /**
     * 如果不允许用户随意取消订单，就用下面这段代码
     */
    wx.showModal({
      title: '提示!',
      content: '菜品已在制作中,请去收银台联系店员进行取消',
    })




  }
})