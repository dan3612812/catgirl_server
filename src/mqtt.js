var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://47.74.20.158:1883');
var cont = require('./controller');
var rinfo = cont.rinfo; //讀取 controller.rinfo 變數


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
    var mstatus = msg.status; //0:待機 1:準備中 2:開始 3:斷線 4:戰鬥中 5:結束
    var mid = msg.id;
    var roomcou = rinfo.findIndex(x => x.roomname === mid);// find room index
    if (msg.command == undefined) {
        console.log("--clinet msg--");console.log("roomcount: " + roomcou);
    } else {
        console.log("----server msg----"); console.log("command: " + msg.command);
    }
    console.log("topic: " + topic + " message :" + message.toString());
    console.log("mstatus :" + mstatus); console.log("id:" + mid);
   
    console.log("--------------------");
    //收到兩個start 的 topic 才發送 startgame
    //收到client的訊息 就幫他傳送一次訊息
    if (mstatus == 1) {
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
    if (mstatus == 0) {
        //取消 要看對方是否 非開始  才能取消準備
        // console.log("into mstatus 0");
        // console.log("rinfo[roomcou].player1:" + rinfo[roomcou].player1);
        // console.log("rinfo[roomcou].p2status:" + rinfo[roomcou].p2status);  cont.chrinfo(0, "player1", "123");
        if (rinfo[roomcou].player1 == mid && rinfo[roomcou].p2status != "2") { rinfo[roomcou].p1status = 0 };
        if (rinfo[roomcou].player2 == mid && rinfo[roomcou].p1status != "2") { rinfo[roomcou].p2status = 0 };
    }

    //戰鬥中 echo
    if (mstatus == 4) {
        console.log("mstatus=4:" + rinfo[roomcou].player1);
        if (msg.command == undefined) { //確認不是server傳的 
            var newcom = "command"; var newval = "echo";
            msg[newcom] = newval;
            client.publish(topic, JSON.stringify(msg), { qos: 2 });
        }
    }
    //遊戲結束 刪除房間
    if (mstatus == 5) {
        //發送 mqtt end 訊號
        var temp = {
            "id": "server",
            "command": "end"
        }
        client.publish(topic, JSON.stringify(temp), { qos: 2 });
        //刪除陣列資料
        if (roomcou > -1) { rinfo.splice(roomcou, 1) };

    }

    //----------------------test-------------------//
    //test  change controller.js rinfo variable
    if (mstatus == "8") {
        rinfo[0].player2 = "asdfasdf";
        console.log(rinfo[0]);
    }
    if (mstatus == "7") {
        // 7 =='7' is ture
        console.log("this is 7 =='7'");
    }
    if (mstatus == "00") {
        var temp = { "": "" };
        cont.chrinfo(0, temp);
        console.log(rinfo[0]);// 會等上面做完 才console.log
    }
    if (mstatus == "000") {
        cont.chrinfo(0, "player1", "123");
        console.log("this 000");
    }
    //check  var
    if (mstatus == "11") {
        console.log(" check p1status:" + rinfo[0].p1status);
    }
    //----------------------to test end----------------//
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