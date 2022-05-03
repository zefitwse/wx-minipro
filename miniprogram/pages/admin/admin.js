const app = getApp()
let Name = ""
let password = ""
const db = wx.cloud.database()
Page({
  data: {
    isAdmin: false,
  },
  //去后厨管理页
  goHouchu() {
    wx.navigateTo({
      url: '/pages/adminHouchu/adminHouchu',
    })
  },

  onLoad() {
    // let admin = wx.getStorageSync('admin')
    // if (admin && admin.name && admin.password) {
    //   //每次进入管理页都校验账号密码，防止离职员工登录
    //   this.login(admin.name, admin.password)
    // }
  },
  //管理员登陆相关
  getName(e) {
    Name = e.detail.value
    console.log("e,name",e)
  },

  getPassWord(e) {
    password = e.detail.value
  },
  formSubmit() {
    if (Name == '' || Name == undefined) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none'
      })
      return;
    }
    if (password == '' || password == undefined) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }
    console.log(Name,password)
    this.login(Name, password)
  },
  //登录
  login(name, password) {
    db.collection('admin').where({
        name: name,
        password: password
      }).get()
      .then(res => {
        console.log("登陆成功", res)
        if (res.data && res.data.length > 0) {
          this.setData({
            isAdmin: true
          })
          let admin = {
            name: name,
            password: password
          }
          wx.setStorageSync('admin', admin)
          console.log('admin', admin)
          wx.navigateTo({
            url: '../houchu/houchu',
          })
        } else {
          this.setData({
            isAdmin: false
          })
          wx.showToast({
            icon: 'none',
            title: '账号或密码错误',
          })
        }
      }).catch(res => {
        console.log("登陆失败", res)
        wx.showToast({
          icon: 'none',
          title: '账号或密码错误',
        })
        this.setData({
          isAdmin: false
        })
      })
  }


})