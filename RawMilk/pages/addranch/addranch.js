// pages/addranch/addranch.js
//json工具包
var Util = require('../../utils/json.js')
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //牧场名称
    name: ""
  },

  /**
   * 监听名称输入
   */
  name: function (e) {
    this.data.name = e.detail.value
  },

  /**
   * 添加牧场
   */
  addranch: function () {
    var that = this
    if (that.data.name) {
      wx.request({
        url: app.globalData.server + "/ranch/add",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: Util.json2Form({ RanchName: that.data.name }),
        success: function (res) {
          wx.navigateBack()
        }
      })
    }
  }
})