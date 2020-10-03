//index.js
//获取应用实例
const app = getApp()
//json工具包
var Util = require('../../utils/json.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //是否有数据
    hasdata: false,
    //数据列表
    datalist: [],
    //牧场列表
    ranchid: [],
    ranchlist: [],
    ranch_index: 0,
    //奶罐列表
    tanklist: [],
    tank_index: 0,
    //温度数据
    temp: [],
    //当前时间
    time: "",
    //实时
    RanchID: 0,
    MilktankID: 0
  },

  /**
   * 页面加载时
   */
  onLoad: function () {
    //判断是否登录
    if (!app.globalData.loginflag) {
      wx.redirectTo({
        url: "../login/login"
      })
    }
  },

  /**
   * 牧场选择
   */
  bindRanchChange: function (e) {
    var that = this
    that.setData({
      ranch_index: e.detail.value,
      time: getNowFormatDate()
    })
    //更新奶罐
    var tanklist = []
    for (var i = 0; i < that.data.datalist.length; i++) {
      if (that.data.datalist[i].RanchName == that.data.ranchlist[e.detail.value]) {
        tanklist.push(that.data.datalist[i].MilktankID)
      }
    }
    that.setData({
      tanklist: tanklist,
      tank_index: 0,
      RanchID: that.data.ranchid[e.detail.value],
      MilktankID: that.data.tanklist[that.data.tank_index]
    })
    //先更新一下数据
    wx.request({
      url: app.globalData.server + "/temp",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: Util.json2Form({ RanchID: that.data.ranchid[e.detail.value], MilktankID: tanklist[0], Date: that.data.time }),
      success: function (res) {
        that.setData({
          temp: res.data
        })
      }
    })
  },

  /**
   * 奶罐选择
   */
  bindTankChange: function (e) {
    var that = this
    that.setData({
      tank_index: e.detail.value,
      time: getNowFormatDate(),
      RanchID: that.data.ranchid[that.data.ranch_index],
      MilktankID: that.data.tanklist[e.detail.value]
    })
    //先更新一下数据
    wx.request({
      url: app.globalData.server + "/temp",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: Util.json2Form({ RanchID: that.data.ranchid[that.data.ranch_index], MilktankID: that.data.tanklist[e.detail.value], Date: that.data.time }),
      success: function (res) {
        that.setData({
          temp: res.data
        })
      }
    })
  },

  /**
   * 页面显示时
   */
  onShow: function () {
    var that = this
    that.setData({
      time: getNowFormatDate()
    })
    //首先获取奶罐列表
    wx.request({
      url: app.globalData.server + "/temp/tank",
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.length) {
          var ranchid = []
          var ranchlist = []
          var tanklist = []
          that.setData({
            datalist: res.data
          })
          //获取牧场列表
          for (var i = 0; i < res.data.length; i++) {
            var flag = true
            for (var j = 0; j < ranchlist.length; j++){
              if (ranchlist[j] == res.data[i].RanchName) {
                flag = false
              }
            }
            if (flag) {
              ranchlist.push(res.data[i].RanchName)
              ranchid.push(res.data[i].RanchID)
            }
          }
          //获取默认选择的牧场的奶罐
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].RanchName == ranchlist[0]) {
              tanklist.push(res.data[i].MilktankID)
            }
          }
          //获取初始化的数据
          wx.request({
            url: app.globalData.server + "/temp",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: Util.json2Form({ RanchID: ranchid[that.data.ranch_index], MilktankID: tanklist[that.data.tank_index], Date: that.data.time}),
            success: function (res) {
              that.setData({
                temp: res.data
              })
            }
          })
          that.setData({
            hasdata: true,
            ranchid: ranchid,
            ranchlist: ranchlist,
            tanklist: tanklist,
            RanchID: ranchid[that.data.ranch_index],
            MilktankID: tanklist[that.data.tank_index],
          })
          //动态刷新
          that.update()
        }  else {
          that.setData({
            hasdata: false,
            ranchlist: [],
            tanklist: [],
            ranchid: [],
          })
        }    
      }
    })
  },

  /**
   * 实时更新
   */
  update: function () {
    var that = this
    that.setData({
      time: getNowFormatDate()
    })
    //5秒刷新一次
    setTimeout(function () {
      wx.request({
        url: app.globalData.server + "/temp",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: Util.json2Form({ RanchID: that.data.RanchID, MilktankID: that.data.MilktankID, Date: that.data.time }),
        success: function (res) {
          that.setData({
            temp: res.data
          })
          that.update()
        }
      })
    }, 5000)
  }
})

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
