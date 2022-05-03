
var app = getApp()
let orderStatus = 0; //0新下单待制作,2订单已完成
let db = wx.cloud.database();


Page({
  data: {
    // 顶部菜单切换
    navbar: ["待制作菜品",  "已完成"],
    // 默认选中菜单
    currentTab: 0,
    isShowComment: false, //是否显示评论框
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
    } else {
      orderStatus = 0;
    }
    this.getMyOrderList();
  },

  onShow: function () {
    orderStatus = 0
    this.getMyOrderList()
  },

  getMyOrderList() {
    let openid = app._checkOpenid();
    if (!openid) {
      return;
    }
    //请求自己后台获取用户openid
    wx.cloud.callFunction({
        name: 'getOrderList',
        data: {
          action:'admin',
          orderStatus: orderStatus
        }
      })
      .then(res => {
        console.log("用户订单列表", res)
        this.setData({
          list: res.result.data
        })
      }).catch(res => {
        console.log("用户订单列表失败", res)
      })
  },
  //制作完成
  zhizuowancheng(e) {
    console.log(e.currentTarget.dataset.id)
    wx.cloud.callFunction({
      name: 'houchu',
      data: {
        id: e.currentTarget.dataset.id
      }
    }).then(res => {
      console.log('制作完成ok', res)
      if (res.result && res.result.stats && res.result.stats.updated > 0) {
        wx.showToast({
          title: '修改成功',
        })
        this.getMyOrderList()
      } else {
        wx.showToast({
          icon: 'none',
          title: '提交失败',
        })
      }
    }).catch(res => {
      console.log('制作完成no', res)
      wx.showToast({
        icon: 'none',
        title: '提交失败',
      })
    })
  },

  //退出页面
  // onUnload() {
  //   console.log("onUnload")
  //   // innerAudioContext.destroy() //退出页面时销毁音频
  //   // watcher.close() //关闭监听
  // }

})