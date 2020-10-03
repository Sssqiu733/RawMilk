// pages/login/login.js
//json工具包
var Util = require('../../utils/json.js')
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //账号
    count: "",
    //密码
    password: "",
  },

  /**
   * 监听账号输入
   */
  count: function (e) {
    this.data.count = e.detail.value
  },

  /**
   * 监听密码输入
   */
  password: function (e) {
    this.data.password = e.detail.value
  },

  /**
   * 登录操作
   */
  login: function () {
    var that = this
    //检验数据
    if (that.data.count && that.data.password) {
      //提示框
      wx.showLoading({
        title: "登录中",
        mask: true
      })
      //登录请求
      wx.request({
        url: app.globalData.server + "/login",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: Util.json2Form({Count: that.data.count, Password: that.data.password }),
        success: function (res) {
          wx.hideLoading()
          if (res.data == false) {
            //账号不存在/密码错误
            wx.showModal({
              title: '错误',
              content: '账号不存在/密码错误',
              //不显示取消按钮
              showCancel: false,
              confirmText: '确定'
            }) 
          } else if (res.data == 'error') {
            //服务器异常
            wx.showModal({
              title: '错误',
              content: '服务器异常，请重试!',
              //不显示取消按钮
              showCancel: false,
              confirmText: '确定'
            })
          } else {
            //登录成功提示
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            })
            //设置登录标志
            app.globalData.loginflag = true
            //设置登录身份
            app.globalData.localname = that.data.count
            //进入首页
            wx.switchTab({
              url: "../index/index"
            })
          }
        },
        fail: function (err) {
          wx.hideLoading()
          //服务器异常
          wx.showModal({
            title: '错误',
            content: '服务器异常，请重试!',
            //不显示取消按钮
            showCancel: false,
            confirmText: '确定'
          }) 
        }
      })
    } else {
      //数据错误
      wx.showModal({
        title: '错误',
        content: '请输入账号/密码',
        //不显示取消按钮
        showCancel: false, 
        confirmText: '确定'
      }) 
    }
  }
})