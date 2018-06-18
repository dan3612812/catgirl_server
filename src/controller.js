
var request = require("request"); // 訪問request
var Sequelize = require('sequelize'); //多功能資料庫查詢
var mqtt = require('./mqtt.js');
var rl = ['test1', 'test2'];
var rlc = [0, 0];
exports.rinfo = [{ 'roomname': 'test', 'player1': 'p1', 'player2': 'p2', 'playcou': 0, 'p1status': 0, 'p2status': 0 }]


// client request room list 
exports.roomlist = function (req, res) {
    res.send(rl);
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
    // if (rlc[roomcou] < 2) {
    //     rlc[roomcou]++;
    //     res.send('success');
    // } else {
    //     res.send('full');
    // }
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