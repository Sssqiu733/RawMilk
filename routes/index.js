var express = require('express');
var db = require('./mysql.js');
var base64 = require('./base64');
var code = new base64.Base64();
var router = express.Router();

/**
 * 获取服务器信息页
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: '生鲜乳温度监控系统' });
});

/**
 * 登录操作
 */
router.post('/login',function (req, res, next) {
    //将用户提交的表单数据转化为JSON格式
    var data = {
        Count:req.body.Count,
        Password:req.body.Password
    };
    //登录sql语句
    var sql = "select * from users where Count = '" + data.Count + "' and Password = '" + code.encode(data.Password) + "'";
    db.exec(sql,[156],function(err,r){
        if (err){
            //数据库错误
            console.log(err);
            res.send('error');
        }
        if (r.length){
            //登录成功，返回用户数据
            //返回的数据类型
            res.contentType('json');
            //给客户端返回json格式的数据
            res.send(JSON.stringify(r[0]));
            res.end();
        }else {
            //登录失败，原因：用户不存在或密码错误
            res.send('false');
        }
    });
});

/**
 * 获取牧场列表
 */
router.get('/ranch',function (req, res, next) {
   var sql = "select * from ranchs"
    db.exec(sql,[156],function (err,r) {
        //返回的数据类型
        res.contentType('json');
        //给客户端返回json格式的数据
        res.send(JSON.stringify(r));
        res.end();
    });
});

/**
 * 删除牧场
 */
router.post('/ranch/del',function (req, res, next) {
    //将用户提交的表单数据转化为JSON格式
    var data = {
        RanchID:req.body.RanchID
    };
    var sql = "delete from ranchs where RanchID=" + parseInt(data.RanchID);
    db.exec(sql,[156],function (err,r) {
        res.send('true');
    });
});

/**
 * 添加牧场
 */
router.post('/ranch/add',function (req, res, next) {
    //将用户提交的表单数据转化为JSON格式
    var data = {
        RanchName:req.body.RanchName
    };
    var sql = "insert into ranchs(RanchName) values('" + data.RanchName + "')";
    db.exec(sql,[156],function (err,r) {
      res.send('true');
    });
});

/**
 *获取温度数据
 */
router.post('/temp',function (req, res, next) {
    //将用户提交的表单数据转化为JSON格式
    var data = {
        RanchID:req.body.RanchID,
        MilktankID:req.body.MilktankID,
        Date:req.body.Date
    };
    var sql = "select * from temps where RanchID=" + parseInt(data.RanchID) + " and MilktankID=" + parseInt(data.MilktankID) + " and Date='" + data.Date  + "' order by ID desc limit 10";
    db.exec(sql,[156],function (err,r) {
        //返回的数据类型
        res.contentType('json');
        //给客户端返回json格式的数据
        res.send(JSON.stringify(r));
        res.end();
    });
});

/**
 * 获取奶罐记录表
 */
router.get('/temp/tank',function (req, res, next) {
   var sql = "select ranchs.RanchName,tanks.RanchID,tanks.MilktankID from tanks,ranchs where tanks.RanchID=ranchs.RanchID";
   db.exec(sql,[156],function (err,r) {
       //返回的数据类型
       res.contentType('json');
       //给客户端返回json格式的数据
       res.send(JSON.stringify(r));
       res.end();
   });
});

/**
 * 获取历史温度数据
 */
router.post('/temp/history',function (req, res, next) {
    //将用户提交的表单数据转化为JSON格式
    var data = {
        RanchID:req.body.RanchID,
        MilktankID:req.body.MilktankID,
        Date:req.body.Date,
        Milkstatus:req.body.Milkstatus
    };
    var sql = "select * from temps where RanchID=" + parseInt(data.RanchID) + " and MilktankID=" + parseInt(data.MilktankID) + " and Date='" + data.Date  + "' and Milkstatus='" + data.Milkstatus + "' order by ID desc";
    db.exec(sql,[156],function (err,r) {
        //返回的数据类型
        res.contentType('json');
        //给客户端返回json格式的数据
        res.send(JSON.stringify(r));
        res.end();
    });
});

/**
 * 温度统计
 */
router.post('/temp/tongji',function (req, res, next) {
    //将用户提交的表单数据转化为JSON格式
    var data = {
        RanchID:req.body.RanchID,
        MilktankID:req.body.MilktankID,
        Date:req.body.Date,
        Date_end:req.body.Date_end,
        Milkstatus:req.body.Milkstatus
    };
    var sql = "select temps.Date as date,round(avg(temps.Temp)) as tempavg,max(temps.Temp) as tempmax,min(temps.Temp) as tempmin,sum(temps.Alarm) as alarmsum from temps where RanchID=" + parseInt(data.RanchID) + " and MilktankID=" + parseInt(data.MilktankID) + " and (Date between '" + data.Date  + "' and '" + data.Date_end + "') and Milkstatus='" + data.Milkstatus + "' group by Date";
    console.log(sql);
    db.exec(sql,[156],function (err,r) {
        //返回的数据类型
        res.contentType('json');
        //给客户端返回json格式的数据
        res.send(JSON.stringify(r));
        res.end();
    });
});

/**
 * 获取用户列表
 */
router.get('/users',function (req, res, next) {
    var sql = "select * from users";
    db.exec(sql,[156],function (err,r) {
        //返回的数据类型
        res.contentType('json');
        //给客户端返回json格式的数据
        res.send(JSON.stringify(r));
        res.end();
    });
});

/**
 * 添加员工
 */
router.post('/users/add',function (req, res, next) {
    //将用户提交的表单数据转化为JSON格式
    var data = {
        Name:req.body.Name,
        Count:req.body.Count,
        Password:req.body.Password,
        Sex:req.body.Sex,
        IDCard:req.body.IDCard,
        Mailbox:req.body.Mailbox,
        Phone:req.body.Phone
    };
    var sql = "insert into users(Name,Count,Password,Sex,IDCard,Mailbox,Phone) values('" + data.Name + "','" + data.Count + "','" + code.encode(data.Password) + "','" + data.Sex + "','" + data.IDCard + "','" + data.Mailbox + "','" + data.Phone + "')";
    db.exec(sql,[156],function (err,r) {
      res.send('true');
    });
});

/**
 * 删除员工
 */
router.post('/users/del',function (req, res, next) {
    //将用户提交的表单数据转化为JSON格式
    var data = {
        ID:req.body.ID
    };
    var sql = "delete from users where ID=" + parseInt(data.ID);
    db.exec(sql,[156],function (err,r) {
        res.send('true');
    });
});

/**
 * 数据解析存入数据库
 * 使用http post的传输方式
 */
router.post('/data',function (req, res, next) {
    //将用户提交的表单数据转化为JSON格式
    var data = {
        RanchID:req.body.RanchID,
        MilktankID:req.body.MilktankID,
        Milkstatus:req.body.Milkstatus,
        Temp:req.body.Temp,
        Alarm:req.body.Alarm,
        Date:req.body.Date,
        Time:req.body.Time
    };
    //存入sql语句
    var add = "insert into temps(RanchID,MilktankID,Milkstatus,Temp,Alarm,Date,Time) values(" + data.RanchID + "," + data.MilktankID + ",'" + data.Milkstatus + "','" + data.Temp + "'," + data.Alarm + ",'" + data.Date + "','" + data.Time + "')";
    //存入到数据库
    db.exec(add,[156],function (err,r) {
       console.log('存入完成！');
    });
});

module.exports = router;
