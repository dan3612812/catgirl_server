
//var request = require("request"); // 訪問request
//var Sequelize = require('sequelize'); //多功能資料庫查詢
var rinfo = [{ 'roomname': 'p1', 'player1': 'p1', 'player2': 'p2', 'playcou': 0, 'p1status': 4, 'p2status': 4 }, { 'roomname': 'p1', 'player1': 'p1', 'player2': 'p2', 'playcou': 0, 'p1status': 3, 'p2status': 3 }];
exports.rinfo = rinfo;
var tfn = "controller";
var mqtt = require('./mqtt.js');
var clog = require('./clog.js');
var crypto = require("crypto");

// 更改內容 obj
exports.chrinfo = function (roomcou, obj) {
    rinfo[roomcou] = obj;
}
// 更改單一格值
exports.chrinfo = function (roomcou, key, value) {
    rinfo[roomcou][key] = value;
    // console.log("key:" + key + " value:" + value);
}

// client request room list 
exports.roomlist = function (req, res) {
    //console.log("roomlist");
    res.send(rinfo);
}

//clinet request create room and treat id  as topic
exports.createroom = function (req, res) {
    var id = req.body.id;
    var roomcou = rinfo.findIndex(x => x.roomname === id);// find room index
    var tmsg = "POST:createroom\n"
    if (id == undefined) {
        tmsg += "id:undefind \nERROR";
        clog.log(tfn, tmsg, 0);
        res.send('error');
    } else {
        //判斷是否重複房間
        if (roomcou == -1) {
            var temp = { 'roomname': id, 'player1': id, 'player2': '', 'playcou': 1, 'p1status': 0, 'p2status': 0 }
            rinfo.push(temp);
            //呼叫mqtt 訂閱
            tmsg += "id:" + id + "\nSUCCESS";
            clog.log(tfn, tmsg, 0);
            mqtt.addsubcribe(id);// 'room/catgirl/'+id
            res.send('success');
        } else {
            tmsg += "id:" + id + "\n REPEAT";
            clog.log(tfn, tmsg, 0);
            res.send('repeat');
        }
    }
}

//加入房間
exports.joinroom = function (req, res) {
    var roomid = req.body.roomid;
    var id = req.body.id;
    var tmsg = "POST:joinroom \nroomname:" + roomid + "\njoinplayer:" + id;

    var roomcou = rinfo.findIndex(x => x.roomname === roomid);// find room index
    if (roomcou == -1 || id == undefined) { res.send('error'); tmsg += "\nERROR" } else {
        if (rinfo[roomcou].playcou < 2) {
            rinfo[roomcou].playcou++;
            rinfo[roomcou].player2 = id;
            res.send('success');
            //發送mqtt 指令 房間 與p2 id
            mqtt.jroom(roomid, id);
            tmsg += "\nSUCCESS";
        } else {
            res.send('full');
            tmsg += "\nFULL";
        }
    }
    clog.log(tfn, tmsg, 0);
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