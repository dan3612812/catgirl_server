var mqtt = require('mqtt');
var auth = require('../config/auth.js');

var opts = auth.mqtt_will;
var client = mqtt.connect(auth.mqtt.host, { will: opts });
var cont = require('../controller/controller.js');
var clog = require('../config/clog.js');
//var mslt = require('../config/auth').mqtt_will.topic; //mqtt_server_log topic 同opts.topic
var tfn = "mqtt";
var rinfo = cont.rinfo; //讀取 controller.rinfo 變數

client.on('connect', function () {
    client.subscribe('catgirl_room');
    client.subscribe('catgirl/room/p1');
});
// ////////test //////////
// var temp = { "id": "p1", "status": "6", "test1": "t1", "test2": "t2" };
// client.publish('catgirl_room', JSON.stringify(temp), { qos: 1 });
////////////////////

client.on('message', async function (topic, message) {

    //---- 監聽 mqtt room ----//
    try {
        var msg = JSON.parse(message);
    } catch (error) {
        clog.log(tfn, "parse err", 3);
        return //離開
    }
    var mstatus = msg.status; //0:待機 1:準備中 2:開始 3:斷線 4:戰鬥中 5:結束 
    var mid = msg.id;
    var mtopic = topic.split("/").pop();
    var roomcou = rinfo.findIndex(x => x.roomname === mtopic);// find room index
    var tmsg = "";

    //Judgment START------------------------
    //判斷錯誤格式或未完整JSON包或參數錯誤 直接離開
    if (msg.command == undefined) {
        if (mstatus == undefined) { //錯誤格式
            clog.log(tfn, "4", 4);
        } else {                      //clinet msg
            tmsg = "room_serial:" + (roomcou == -1 ? "ERROR" : roomcou);
            tmsg += "\ntopic:" + mtopic + "\nid:" + mid + "\nstatus:" + mstatus;
            //tmsg += "\n" + JSON.stringify(msg);
            clog.log(tfn, tmsg, 1);
        }
    } else {                        //server msg        
        tmsg = "\nid:" + mid + "  command:" + msg.command; + "\ntopic:" + mtopic;
        clog.log(tfn, tmsg, 0);
    }

    //無此房間 就不做事
    if (roomcou == -1) { return }
    //Judgment END---------------------------

    //收到兩個start 的 topic 才發送 startgame
    //收到client的訊息 就幫他傳送一次訊息
    if (mstatus == 1) {
        if (rinfo[roomcou].player1 == mid) {
            await cont.chrinfo(roomcou, "p1status", "1");
        };
        if (rinfo[roomcou].player2 == mid) {
            await cont.chrinfo(roomcou, "p2status", "1");
        };
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
        if (rinfo[roomcou].player1 == mid && rinfo[roomcou].p2status != "2") { rinfo[roomcou].p1status = 0 };
        if (rinfo[roomcou].player2 == mid && rinfo[roomcou].p1status != "2") { rinfo[roomcou].p2status = 0 };
    }

    //房主離開 刪除房間
    if (mstatus == 3) {
        if (rinfo[roomcou].roomname == mtopic && mtopic == mid) {
            clog.log(tfn, "del room roomname:" + rinfo[roomcou].roomname + "\n this room is exist", 2);
            rinfo.splice(roomcou, 1);
            // 通知 clinet
            var temp = {
                "id": "server",
                "command": "leave"
            }
            client.publish(topic, JSON.stringify(temp), { qos: 2 });
        }
    }

    //遊戲結束 
    if (mstatus == 5) {
        //發送 mqtt end 訊號
        var temp = {
            "id": "server",
            "command": "end"
        }
        client.publish(topic, JSON.stringify(temp), { qos: 2 });
    }
    //有人無故斷線
    if (mstatus == 8) {
        if (mtopic == mid) { // 當發出訊息者為房主時
            rinfo.splice(roomcou, 1);
            var temp = {
                "id": topic,
                "status": 8
            }
            client.publish(opts.topic, JSON.stringify(temp) + "\n 意外斷線", { qos: 2 })
        }
    }


    //戰鬥中 echo
    /*
    if (mstatus == 4) {
        if (msg.command == undefined) { //確認不是server傳的 
            var newcom = "command"; var newval = "echo";
            msg[newcom] = newval;
            client.publish(topic, JSON.stringify(msg), { qos: 2 });
        }
    }
    */


    //-----------------this client.on test-------------------//
    //test  change controller.js rinfo variable
    if (mstatus == "88") {
        rinfo[0].player2 = "asdfasdf";
        console.log(rinfo[0]);
    }
    if (mstatus == "77") {
        // 7 =='7' is ture
        console.log("this is 7 =='7'");
    }
    if (mstatus == "33") {
        var temp = { "": "" };
        await cont.chrinfo(0, temp);
        console.log(rinfo[0]);// 會等上面做完 才console.log
    }
    if (mstatus == "22") {
        await cont.chrinfo(0, "player1", "123");
        console.log("this 22");
    }
    //check  var
    if (mstatus == "11") {
        console.log(" check p1status:" + rinfo[0].p1status);
    }
    //----------------this client.on to test END----------------//
});

//告知該topic 有人加入房間
exports.jroom = function (topic, twoid) {
    var temp = {
        "id": "server",
        "command": "join",
        "player": twoid,
        "roomname": topic
    }
    client.publish('catgirl/room/' + topic, JSON.stringify(temp), { pos: 2 });
    client.publish(opts.topic, JSON.stringify(temp), { qos: 2 })
}

// 新訂閱房間
exports.addsubcribe = function (room) {
    client.subscribe('catgirl/room/' + room);
    var temp = {
        "id": "server",
        "command": "newroom",
        "roomname": room
    }
    clinet.publish(opts.topic, JSON.stringify(temp), { qos: 2 });
}
//client.publish('catgirl_room', 'this is server publish', { qos: 1 });






//使用 mqtt 達成 post 功能
//----------not use-----------//
//推訊息
exports.mqttpub = function (topic, message) {
    client.publish('catgirl/' + topic, message, { qos: 2 });
}

exports.createroom = function (roomid) {
    // to publish mqtt
    var temp = {
        instr: 'cr',
        roomid: roomid
    }
    client.publish('catgirl_roomlist', JSON.stringify(temp), { qos: 2 });
}

exports.delroom = function (roomid, roomname) {
    var temp = {
        instr: 'dr',
        roomid: roomid,
        roomname: roomname
    }
    client.publish('catgirl_roomlist', JSON.stringify(temp), { qos: 2 });
}