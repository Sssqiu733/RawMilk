/**
 * 动态创建奶罐并且实时更新温度
 */
var db = require('./mysql.js');

//修改牧场编号和奶罐编号
var muchanid = 1;
var tankid = 1;

//创建奶罐
var tank = "insert into tanks values(" + muchanid + "," + tankid + ")";
var add = "insert into temps(RanchID,MilktankID,Milkstatus,Temp,Alarm,Date,Time) values(" + muchanid + "," + tankid + ",'预冷前','36',0,'" + getNowFormatDate() + "','" + getTime() + "')";
db.exec(tank,[156],function (err,r) {
    db.exec(add,[156],function (err,r) {
        //开启五分钟动态随机更新一次温度
        schedule();
    });
});

function schedule() {
    setTimeout(do_it, 60000, schedule);
}

function do_it(callback) {
    console.log("西部牧场奶罐01温度变化！");
    var temp = RandomNum(0,50);
    var alarm = 0;
    if (temp >= 37 ) {
        alarm = 1;
    } else if (temp >= 39) {
        alarm = 2;
    }
    var update = "insert into temps(RanchID,MilktankID,Milkstatus,Temp,Alarm,Date,Time) values(" + muchanid + "," + tankid + ",'预冷前','" + temp + "'," + alarm + ",'" + getNowFormatDate() + "','" + getTime() + "')";
    db.exec(update,[156],function (err,r) {
        callback();
    });
}

//获取创建奶罐日期
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

//获取创建奶罐时间
function getTime() {
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
    var currentdate = date.getHours() + seperator2 + date.getMinutes();
    return currentdate;
}

//生成从[minNum,maxNum)的随机数
function RandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.floor(Rand * Range); //舍去
    return num;
}
