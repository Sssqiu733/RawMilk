// pages/historyinfo/historyinfo.js
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
    temp: [],
    hasdata: true,
    //图表数据
    time: [],
    temps: [],
    alarm: []
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
    info.RanchID = data[2]
    info.MilktankID = data[3]
    info.RanchName = data[4]
    that.setData({
      info: info
    })
    //获取历史温度
    wx.request({
      url: app.globalData.server + "/temp/history",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: Util.json2Form(info),
      success: function (res) {
        if (res.data.length) {
          var time = []
          var temps = []
          var alarm = []
          for (var i = res.data.length-1;i>=0;i-=60) {
            time.push(res.data[i].Time)
            temps.push(res.data[i].Temp)
            alarm.push(res.data[i].Alarm)
          }
          that.setData({
            temp: res.data,
            hasdata: true,
            time: time,
            temps: temps,
            alarm: alarm
          })
        } 
        new wxCharts({
          canvasId: 'lineCanvas1',
          type: 'line',
          categories: that.data.time,
          animation: true,
          background: '#fff',
          series: [{
            name: '温度',
            data: that.data.temps,
            format: function (val, name) {
              return val.toFixed(2) + '万';
            }
          }, {
            name: '报警',
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