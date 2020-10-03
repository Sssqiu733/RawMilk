/**
 * 动态制冷设备
 */
var db = require('./mysql.js');

//修改牧场编号和奶罐编号
var state = "预冷前";
var muchanid = 2;
var tankid = 1;

var sql = "update temps set Milkstatus='" + state + "' where RanchID=" + muchanid + " and MilktankID=" + tankid;
db.exec(sql,[156],function (err,r) {
   console.log('修改了机器状态');
});