// pages/food/food.js
let app = getApp();
const db = wx.cloud.database({});
Page({
  data: {
    searchKey: '', //搜索词
    foodList:[],
    cartList:[],
    totalPrice: 0, // 总价，初始为0
    totalNum: 0, //总数，初始为0
    hasList: false, // 列表是否有数据
    animationData: {},
    animationMask: {},
    maskVisual: "hidden",
    maskFlag: true,
  },

  onLoad: function (e) {
    if(app.globalData.hasLogin==false){
      wx.showModal({
        title:"未登录",
        success:function (res) {
          if(res.confirm){
            wx.navigateTo({
              url: '../userLogin/accountLogin',
            })
          }else{
            wx.switchTab({
              url: '../mine/mine',
            })
          }
        }
      })
    }
    else{
    if(e.mode=="2"){
      wx.cloud.database().collection("food").where({
        leibie:e.kind,
        // status:"上架"
      })
      .get()
      .then(res=>{
        this.setData({
          foodList:res.data
        })
        console.log("获取到food表",res.data)
      })
    }
    else{
      let searchKey = e.searchKey
   
      if (searchKey) {
        //搜索菜品
        this.getFoodList('search', searchKey)
        this.setData({
          searchKey: searchKey //搜索词
        })
      } else {
        //获取菜品数据
        this.getFoodList('getAll')
      }
  }
}
  },
  getSearchKey(e) {
    this.setData({
      searchKey: e.detail.value //搜索词
    })
  },
  //搜索事件
  goSearch() {
    this.getFoodList('search', this.data.searchKey)
  },
  getFoodList(action, searchKey) {
    //获取购物车菜品
    let cartList = wx.getStorageSync('cart') || [];
    wx.cloud.callFunction({
      name: "getFoodList",
      data: {
        action: action,
        searchKey: searchKey
      }
    }).then(res => {
      let dataList = res.result.data;
      console.log("菜品数据", res)
      //遍历
      dataList.forEach(food => {
        food.num = 0;
        cartList.forEach(cart => {
          if (cart._id == food._id) {
            food.num = cart.num ? cart.num : 0;
          }
        })
      });
      this.setData({
        cartList: cartList,
        foodList: dataList,
      })
      this.getTotalPrice()
    }).catch(res => {
      console.log("菜品数据请求失败", res)
    })
  },
  jian(e){
    let item = e.currentTarget.dataset.item;
    let cartList = wx.getStorageSync('cart') || [];
    let foodList = this.data.foodList
    for (let i in foodList) {
      if (foodList[i]._id == item._id) {
        if (foodList[i].num && foodList[i].num > 0) {
          foodList[i].num -= 1;
        } else {
          foodList[i].num = 0;
        }
        if (cartList.length > 0) {
          for (let j in cartList) {
            if (cartList[j]._id == item._id) {
              cartList[j].num ? cartList[j].num -= 1 : 0
              if (cartList[j].num <= 0) {
                //购买数里为0就从购物车里删除
                this.removeByValue(cartList, item._id)
              }
              if (cartList.length <= 0) {
                this.setData({
                  foodList: foodList,
                  cartList: [],
                  totalNum: 0,
                  totalPrice: 0,
                })
                // this.cascadeDismiss()
              }
              try {
                wx.setStorageSync('cart', cartList)
              } catch (e) {
                console.log(e)
              }
            }
          }
        }
      }
    }
    this.setData({
      cartList: cartList,
      foodList: foodList
    })
    this.getTotalPrice();
  },
  // 定义根据id删除数组的方法
  removeByValue(array, id) {
    for (var i = 0; i < array.length; i++) {
      if (array[i]._id == id) {
        array.splice(i, 1);
        break;
      }
    }
  },

  jia(e){
    let item = e.currentTarget.dataset.item;
    let arr = wx.getStorageSync('cart') || [];
    let f = false;
    console.log("我是e",e)

    for (let i in this.data.foodList) { // 遍历菜单找到被点击的菜品，数量加1
      console.log("当前点击的id", item, "foodid", this.data.foodList[i])
      if (this.data.foodList[i]._id == item._id) {
        this.data.foodList[i].num += 1;
        if (arr.length > 0) {
          for (let j in arr) { // 遍历购物车找到被点击的菜品，数量加1
            if (arr[j]._id == item._id) {
              arr[j].num += 1;
              f = true;
              try {
                wx.setStorageSync('cart', arr)
              } catch (e) {
                console.log(e)
              }
              break;
            }
          }
          if (!f) {
            arr.push(this.data.foodList[i]);
          }
        } else {
          arr.push(this.data.foodList[i]);
        }
        try {
          wx.setStorageSync('cart', arr)
        } catch (e) {
          console.log(e)
        }
        break;
      }
    }
    this.setData({
      cartList: arr,
      foodList: this.data.foodList
    })
    this.getTotalPrice();
  },
    // 获取购物车总价、总数
  getTotalPrice() {
    var cartList = this.data.cartList; // 获取购物车列表
    var totalP = 0;
    var totalN = 0
    for (var i in cartList) { // 循环列表得到每个数据
      totalP += cartList[i].num * cartList[i].price; // 所有价格加起来     
      totalN += cartList[i].num
    }
    this.setData({ // 最后赋值到data中渲染到页面
      cartList: cartList,
      totalNum: totalN,
      totalPrice: totalP.toFixed(2)
    });
  },


  cleanList(e) {
    for (var i in this.data.foodList) {
      this.data.foodList[i].num = 0;
    }
    try {
      wx.setStorageSync('cart', "")
    } catch (e) {
      console.log(e)
    }
    this.setData({
      foodList: this.data.foodList,
      cartList: [],
      totalNum: 0,
      totalPrice: 0,
    })
    this.cascadeDismiss()
  },

  //删除购物车单项
  deleteOne(e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var arr = wx.getStorageSync('cart')
    for (var i in this.data.foodList) {
      if (this.data.foodList[i]._id == id) {
        this.data.foodList[i].num = 0;
      }
    }
    arr.splice(index, 1);
    if (arr.length <= 0) {
      this.setData({
        foodList: this.data.foodList,
        cartList: [],
        totalNum: 0,
        totalPrice: 0,
      })
      this.cascadeDismiss()
    }
    try {
      wx.setStorageSync('cart', arr)
    } catch (e) {
      console.log(e)
    }
    this.setData({
      cartList: arr,
      foodList: this.data.foodList
    })
    this.getTotalPrice()
  },
  //切换购物车开与关
  cascadeToggle: function () {
    var that = this;
    var arr = this.data.cartList
    if (arr.length > 0) {
      if (that.data.maskVisual == "hidden") {
        that.cascadePopup()
      } else {
        that.cascadeDismiss()
      }
    } else {
      that.cascadeDismiss()
    }
  },
  // 打开购物车方法
  cascadePopup: function () {
    var that = this;
    // 购物车打开动画
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out',
      delay: 0
    });
    that.animation = animation;
    animation.translate(0, -285).step();
    that.setData({
      animationData: that.animation.export(),
    });
    // 遮罩渐变动画
    var animationMask = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    });
    that.animationMask = animationMask;
    animationMask.opacity(0.8).step();
    that.setData({
      animationMask: that.animationMask.export(),
      maskVisual: "show",
      maskFlag: false,
    });
  },
  // 关闭购物车方法
  cascadeDismiss: function () {
    var that = this
    // 购物车关闭动画
    that.animation.translate(0, 285).step();
    that.setData({
      animationData: that.animation.export()
    });
    // 遮罩渐变动画
    that.animationMask.opacity(0).step();
    that.setData({
      animationMask: that.animationMask.export(),
    });
    // 隐藏遮罩层
    that.setData({
      maskVisual: "hidden",
      maskFlag: true
    });
  },
   // 跳转确认订单页面
   gotoOrder: function () {
    var arr = wx.getStorageSync('cart') || [];
    if (!arr || arr.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择菜品'
      })
      return;
    }
    console.log("下单")
    wx.navigateTo({
      url: '../Pay/pay'
    
    })
   
  },
})