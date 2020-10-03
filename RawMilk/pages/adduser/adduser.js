// pages/adduser/adduser.js
//json工具包
var Util = require('../../utils/json.js')
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: {}
  },

  /**
   * 监听输入
   */
  Name: function (e) {
    this.data.info.Name = e.detail.value
  },
  IDCard: function (e) {
    this.data.info.IDCard = e.detail.value
  },
  Sex: function (e) {
    this.data.info.Sex = e.detail.value
  },
  Mailbox: function (e) {
    this.data.info.Mailbox = e.detail.value
  },
  Phone: function (e) {
    this.data.info.Phone = e.detail.value
  },
  Count: function (e) {
    this.data.info.Count = e.detail.value
  },
  Password: function (e) {
    this.data.info.Password = e.detail.value
  },

  /**
   * 添加员工
   */
  add: function () {
    var that = this
    wx.request({
      url: app.globalData.server + "/users/add",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: Util.json2Form(that.data.info),
      success: function (res) {
        wx.navigateBack()
      }
    })
  }
})