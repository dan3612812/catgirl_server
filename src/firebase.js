
// var configAuth = require('../config/auth.js');
// var modules = require('../modules/modules.js');

// //設定log
// import { getLogger } from '../config/logger.js'
// import { start } from 'repl';
// const loggerConsole = getLogger('firebase');


//var serverKey = configAuth.Firebase.serverKey;
var firebase = require("firebase");
var FCM = require('fcm-push'); //引入firbase fcm 套件
//var fcm = new FCM(serverKey);

// exports.firebase_start = async function firebase_start() {

//     var config = {
//         apiKey: "AIzaSyAuPLTBC4_JOZbC9YSXvu5MW53HWYPOuiU",
//         authDomain: "win-pro-inc.firebaseapp.com",
//         databaseURL: "https://win-pro-inc.firebaseio.com",
//         projectId: "win-pro-inc",
//         storageBucket: "win-pro-inc.appspot.com",
//         messagingSenderId: "418847348367"
//     };

//     firebase.initializeApp(config); //初始化firebase 
//     var db = firebase.database();
//     await notification(fcm, db)
// }

//監聽database
// async function notification(fcm, db) {

//     var ref = db.ref("/test"); //選擇firebase database

//     ref.remove(); //清除 database 裡的所有資料
//     var value = {
//         title: "新公告",
//         body: "陸豪線上娃娃機上線瞜"
//     }

//     ref.on("child_added", async function (snapshot) {
//         //fcm_push(snapshot.val().title,snapshot.val().body);
//         loggerConsole.trace('title:' + snapshot.val().title);
//         loggerConsole.trace('body:' + snapshot.val().body);


//     });
//     //ref.push(value); //發送出去開機公告
// }

// async function fcm_push(title, body) {

//     var message = {
//         to: 'ckbMSkcDL_k:APA91bEqL8IO0js115Hv5A8cSdliX-kj6G1ObMq2KyeLYK525kKnrJb8jDjf0NCMqDwThb72lqiUI8ic8nDF_Cl8zIHNGdGWvy-hbzjJ5lh4t2FMLPjuVnbF0wTiKYnnxxXA7UX0TAr7', // required fill with device token or topics
//         data: {
//             title: title,
//             body: body
//         }
//     };

//     console.log(message)
//     fcm.send(message, function (err, response) {
//         if (err) {
//             loggerConsole.trace("Something has gone wrong! " + err);
//         } else {
//             loggerConsole.trace("Successfully sent with response: ", response);
//         }
//     });
// }

exports.firebasegive = function firebasegive(givenickname, gettoken, count, giftname, getgold) {
    loggerConsole.trace("誰給你了:" + givenickname);
    loggerConsole.trace("有人送禮喔:" + gettoken);
    var message = {
        to: gettoken, // required fill with device token or topics
        priority: "high",
        data: {
            title: '送禮',
            getgold: getgold,
            body: givenickname + '送了' + count + '個' + giftname + '給你'
        }
    };

    //callback style
    fcm.send(message, function (err, response) {
        if (err) {
            loggerConsole.trace("firebase Something has gone wrong!");
        } else {
            loggerConsole.trace("送禮 Successfully sent with response: ", response);
        }
    });
}


//=================追蹤發訊息====================//
//	firebase.addtrack(tmemdevice, bmemname);
exports.addtrack = function addtrack(tmemtoken, bmemname) {

    loggerConsole.trace("追蹤人(hentai)：" + bmemname);
    loggerConsole.trace("被追蹤人token：" + tmemtoken);
    var message = {
        to: tmemtoken, // required fill with device token or topics
        priority: "high",
        data: {
            title: '追蹤',
            body: bmemname + '已追蹤你，成為你的粉絲！'
        }
    };

    //callback style
    fcm.send(message, function (err, response) {
        if (err) {
            loggerConsole.trace("firebase Something has gone wrong!");
        } else {
            loggerConsole.trace("追蹤 Successfully sent with response: ", response);
        }
    });

}

//firebase 邀請碼
exports.invite = function invite(data, tmemtoken) {

    console.log("推播firbase邀請碼")

    var message = {
        to: tmemtoken, // required fill with device token or topics
        priority: "high",
        data: {
            title: '有新禮物',
            body: ''
        }
    };
    fcm.send(message, function (err, response) {
        if (err) {
            loggerConsole.trace("firebase Something has gone wrong!");
        } else {
            loggerConsole.trace("追蹤 Successfully sent with response: ", response);
        }
    });
}

//firebase 手機踢人
exports.kick = function kick(token, device, id) {
    if (token != "luhaologinout") {
        loggerConsole.trace("踢人");
        var fcm = new FCM(serverKey);
        var d = new Date()
        var time = d.getTime();
        loggerConsole.trace(time)
        var message = {
            to: token,
            priority: "high",
            data: {
                sys: "byebye",
                title: '君の彼女在其他地方被',
                body: '其他人登入了',
                id: id,
                device: device,
                time: time,
            },
        }
        fcm.send(message, function (err, response) {
            if (err) {
                loggerConsole.trace("Something has gone wrong!");
            } else {
                loggerConsole.trace("Successfully sent with response: ", response);
            }
        });
    }
}
