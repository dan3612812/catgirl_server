var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://127.0.0.1:1883');
var rinfo = require('./controller').rinfo;

client.on('connect', function () {
    client.subscribe('catgirl_room');

});

// ////////test //////////
// var temp = { "id": "p1", "status": "6", "test1": "t1", "test2": "t2" };
// client.publish('catgirl_room', JSON.stringify(temp), { qos: 1 });
////////////////////

client.on('message', function (topic, message) {
    //---- 監聽 mqtt room ----//
    var msg = JSON.parse(message);
    console.log("message.tostring():" + message.toString());
    var mstatus = msg.status; //0:待機 1:準備中 2:開始 3:斷線
    //console.log("mstatus :" + mstatus);
    var mid = msg.id;
    //收到兩個start 的 topic 才發送 startgame
    //收到client的訊息 就幫他傳送一次訊息
    if (mstatus == "1") {
        var roomcou = rinfo.findIndex(x => x.roomname === roomid);// find room index
        if (rinfo[roomcou].player1 == mid) { rinfo[roomcou].p1status == "1" };
        if (rinfo[roomcou].player2 == mid) { rinfo[roomcou].p2status == "1" };
        //雙方都準備好 由server 發訊息 開始
        if (rinfo[roomcou].p1status == "1" && rinfo[roomcou].p2status == "1") {
            var temp = {
                "id": "server",
                "command": "start"
            }
            client.publish(topic, JSON.stringify(temp), { qos: 2 });
        }
    }

    //收到取消訊息 改變狀態
    if (mstatus == "0") {
        var roomcou = rinfo.findIndex(x => x.roomname === roomid);// find room index
        //取消 要看對方是否 非開始  才能取消準備
        if (rinfo[roomcou].player1 == mid && rinfo[roomcou].p2status != "2") { rinfo[roomcou].p1status == "0" };
        if (rinfo[roomcou].player2 == mid && rinfo[roomcou].p1status != "2") { rinfo[roomcou].p2status == "0" };
    }

    //戰鬥中 echo
    if (mstatus == "4") {
        //console.log("into the judgment  mstatus =='4'");
        if (msg.command == undefined) { //確認不是server傳的 
            var newcom = "command"; var newval = "echo";
            msg[newcom] = newval;
            client.publish(topic, JSON.stringify(msg), { qos: 2 });
        }
    }

});

// 新訂閱房間
exports.addsubcribe = function (room) {
    client.subscribe('catgirl/room/' + room);
}

//client.publish('catgirl_room', 'this is server publish', { qos: 1 });









//----------not use-----------//
//推訊息
exports.mqttpub = function (topic, message) {
    client.publish('catgirl/' + topic, message, { qos: 1 });
}

exports.createroom = function (roomid) {
    // to publish mqtt
    var temp = {
        instr: 'cr',
        roomid: roomid
    }
    client.publish('catgirl_roomlist', JSON.stringify(temp), { qos: 1 });
}

exports.delroom = function (roomid, roomname) {
    var temp = {
        instr: 'dr',
        roomid: roomid,
        roomname: roomname
    }
    client.publish('catgirl_roomlist', JSON.stringify(temp), { qos: 1 });
}