
//var request = require("request"); // 訪問request
//var Sequelize = require('sequelize'); //多功能資料庫查詢
var rinfo = [{ 'roomname': 'p1', 'player1': 'p1', 'player2': 'p2', 'playcou': 0, 'p1status': 4, 'p2status': 4 }, { 'roomname': 'p1', 'player1': 'p1', 'player2': 'p2', 'playcou': 0, 'p1status': 3, 'p2status': 3 }];
exports.rinfo = rinfo;
var mqtt = require('./mqtt.js');
var crypto = require("crypto");

// 更改內容 obj
exports.chrinfo = function (roomcou, obj) {
    rinfo[roomcou] = obj;
}
// 更改單一格值
exports.chrinfo = function (roomcou, key, value) {
    rinfo[roomcou][key] = value;
    // console.log("更改單一直 被叫到了");
    // console.log("key:" + key + " value:" + value);
}

// client request room list 
exports.roomlist = function (req, res) {
    res.send(rinfo);
}

//clinet request create room and treat id  as topic
exports.createroom = function (req, res) {
    // 解req 拿 id create mem
    var id = req.body.id;
    //放進陣列
    // rl.push(id);
    // rlc.push(1);
    var temp = { 'roomname': id, 'player1': id, 'player2': '', 'playcou': 1, 'p1status': 0, 'p2status': 0 }
    rinfo.push(temp);
    //呼叫mqtt 訂閱
    mqtt.addsubcribe(id);// 'room/catgirl/'+id
    res.send('success');
}

//加入房間
exports.joinroom = function (req, res) {
    var roomid = req.body.roomid;
    var id = req.body.id;
    //var roomcou = rinfo.find(x => x.roomname === roomid);// find roomname
    var roomcou = rinfo.findIndex(x => x.roomname === roomid);// find room index
    if (roomcou == -1) { res.send('error'); } else {
        if (rinfo[roomcou].playcou < 2) {
            rinfo[roomcou].playcou++;
            rinfo[roomcou].player2 = id;
            res.send('success');
        } else {
            res.send('full');
        }
    }
}

//產生 id 
exports.uid = function (req, res) {
    var temp = { "id": crypto.randomBytes(6).toString('hex') }
    res.send(temp);
}

// test server survival
exports.test = function (req, res) {
    res.send("hello server is survival");
}

// mqtt publish message to topic from post
//server can't get this message beacuse no subscribe this topic
exports.mqttpub = function (req, res) {
    var topic = req.body.topic;
    var message = req.body.message;
    mqtt.mqttpub(topic, message);
    res.send('success');
}