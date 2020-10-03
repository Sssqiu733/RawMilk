// pages/tongji/tongji.js
//获取应用实例
const app = getApp()
//json工具包
var Util = require('../../utils/json.js')
Page({
  data: {
    //阶段选择
    phase: ["请选择阶段", "预冷前", "预冷后", "制冷"],
    phase_index: 0,
    //年份选择
    year: [2018, 2017, 2016, 2015, 2014],
    year_index: 0,
    //月份选择
    month: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    month_index: 4,
    //日选择
    day: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    day_index: 28,
    //年份选择
    year_end: [2018, 2017, 2016, 2015, 2014],
    year_index_end: 0,
    //月份选择
    month_end: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    month_index_end: 4,
    //日选择
    day_end: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    day_index_end: 28,
    //数据列表
    datalist: [],
    //牧场选择
    ranchid: [],
    ranchlist: [],
    ranch_index: 0,
    //奶罐选择
    tanklist: [],
    tank_index: 0,
    //当前日期
    time: ""
  },
  /**
   * 统计
   */
  jump1: function () {
    var that = this
    if (that.data.phase_index != 0) {
      var date = that.data.year[that.data.year_index] + "-" + that.data.month[that.data.month_index] + "-" + that.data.day[that.data.day_index]
      var date_end = that.data.year_end[that.data.year_index_end] + "-" + that.data.month_end[that.data.month_index_end] + "-" + that.data.day_end[that.data.day_index_end]
      var info = that.data.phase[that.data.phase_index] + "," + date + "," + date_end + "," + that.data.ranchid[that.data.ranch_index] + "," + that.data.tanklist[that.data.tank_index] + "," + that.data.ranchlist[that.data.ranch_index]
      wx.navigateTo({
        url: '../tongjiinfo/tongjiinfo?info=' + info
      })
    } else {
      wx.showModal({
        title: '错误',
        content: '请选择阶段',
        //不显示取消按钮
        showCancel: false,
        confirmText: '确定'
      })
    }
  },
  //选择更改
  bindPhaseChange: function (e) {
    this.setData({
      phase_index: e.detail.value
    })
  },
  bindYearChange: function (e) {
    this.setData({
      year_index: e.detail.value
    })
  },
  bindMonthChange: function (e) {
    this.setData({
      month_index: e.detail.value
    })
  },
  bindDayChange: function (e) {
    this.setData({
      day_index: e.detail.value
    })
  },
  bindYearChange_end: function (e) {
    this.setData({
      year_index_end: e.detail.value
    })
  },
  bindMonthChange_end: function (e) {
    this.setData({
      month_index_end: e.detail.value
    })
  },
  bindDayChange_end: function (e) {
    this.setData({
      day_index_end: e.detail.value
    })
  },
  bindRanchChange: function (e) {
    var that = this
    that.setData({
      ranch_index: e.detail.value
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
      tank_index: 0
    })
  },
  bindCannedChange: function (e) {
    this.setData({
      tank_index: e.detail.value
    })
  },

  /**
   * 监听页面显示，获取牧场和奶罐
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
            for (var j = 0; j < ranchlist.length; j++) {
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
          that.setData({
            ranchid: ranchid,
            ranchlist: ranchlist,
            tanklist: tanklist,
            tank_index: 0,
            ranch_index: 0
          })
        }
      }
    })
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