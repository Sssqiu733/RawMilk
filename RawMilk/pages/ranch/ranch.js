// pages/ranch/ranch.js
//json工具包
var Util = require('../../utils/json.js')
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //牧场列表
    ranchs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    //获取牧场数据
    wx.request({
      url: app.globalData.server + "/ranch",
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          ranchs: res.data
        })
      }
    })
  },

  /**
   * 删除牧场
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
            url: app.globalData.server + "/ranch/del",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: Util.json2Form({ RanchID: that.data.ranchs[index].RanchID }),
            success: function (res) {
              wx.showToast({
                title: '牧场已被删除',
                icon: 'success',
                duration: 2000
              })
              that.onShow()
            }
          })
        }
      }
    })
  },

  /**
   * 添加牧场
   */
  addranch: function () {
    wx.navigateTo({
      url: "../addranch/addranch"
    })
  }
})