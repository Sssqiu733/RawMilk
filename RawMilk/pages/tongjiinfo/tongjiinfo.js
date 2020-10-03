// pages/tongjiinfo/tongjiinfo.js
//获取应用实例
const app = getApp()
//json工具包
var Util = require('../../utils/json.js')
//绘图工具
var wxCharts = require('../../utils/wxcharts-min.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    //统计结果
    tongji: [],
    date: [],
    avg: [],
    max: [],
    min: [],
    alarm: [],
    hasdata: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //获取查询的条件
    var data = options.info.split(",")
    var info = {}
    info.Milkstatus = data[0]
    info.Date = data[1]
    info.Date_end = data[2]
    info.RanchID = data[3]
    info.MilktankID = data[4]
    info.RanchName = data[5]
    that.setData({
      info: info
    })
    //获取统计数据
    wx.request({
      url: app.globalData.server + "/temp/tongji",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: Util.json2Form(info),
      success: function (res) {
        var date = []
        var avg = []
        var max = []
        var min = []
        var alarm = []
        for (var i=0;i<res.data.length;i++) {
          date.push(res.data[i].date)
          avg.push(res.data[i].tempavg)
          max.push(res.data[i].tempmax)
          min.push(res.data[i].tempmin)
          alarm.push(res.data[i].alarmsum)
        }
        that.setData({
          tongji: res.data,
          date: date,
          avg: avg,
          max: max,
          min: min,
          alarm: alarm,
          hasdata: true
        })
        new wxCharts({
          canvasId: 'lineCanvas1',
          type: 'line',
          categories: that.data.date,
          animation: true,
          background: '#fff',
          series: [{
            name: '平均温度',
            data: that.data.avg,
            format: function (val, name) {
              return val.toFixed(2) + '万';
            }
          }, {
            name: '最高温度',
            data: that.data.max,
            format: function (val, name) {
              return val.toFixed(2) + '万';
            }
            }, {
              name: '最低温度',
              data: that.data.min,
              format: function (val, name) {
                return val.toFixed(2) + '万';
              }
            }, {
              name: '报警次数',
              data: that.data.alarm,
              format: function (val, name) {
                return val.toFixed(2) + '万';
              }
            }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            title: '次数/温度',
            format: function (val) {
              return val.toFixed(0);
            },
            min: 0
          },
          width: 350,
          height: 300,
          dataLabel: false,
          dataPointShape: true,
          extra: {
            lineStyle: 'curve'
          }
        })
      }
    })
  }
})