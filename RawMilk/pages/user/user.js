// pages/user/user.js
//json工具包
var Util = require('../../utils/json.js')
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    users: [],
    hasdata: false
  },

  /**
   * 监听页面显示
   */
  onShow: function () {
    var that = this
    //判断是否管理员
    if (app.globalData.localname != 'admin') {
      wx.showModal({
        title: '错误',
        content: '你不是管理员，无法进行该操作',
        //不显示取消按钮
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: "../index/index"
            })
          }
        }
      })
    } else {
      //获取用户列表
      wx.request({
        url: app.globalData.server + "/users",
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          var users = []
          for (var i=1;i<res.data.length;i++) {
            users.push(res.data[i])
          }
          if (users.length) {
            that.setData({
              hasdata: true,
              users: users
            })
          }
        }
      })
    }
  },

  /**
   * 添加员工
   */
  adduser: function () {
    wx.navigateTo({
      url: "../adduser/adduser"
    })
  },

  /**
   * 删除员工
   */
  binddel: function (e) {
    var that = this
    //获取当前选择的是那个牧场
    var index = e.currentTarget.dataset.index
    //提示框提示
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          //删除牧场
          wx.request({
            url: app.globalData.server + "/users/del",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: Util.json2Form({ ID: that.data.users[index].ID }),
            success: function (res) {
              wx.showToast({
                title: '员工已被删除',
                icon: 'success',
                duration: 2000
              })
              that.onShow()
            }
          })
        }
      }
    })
  }
})