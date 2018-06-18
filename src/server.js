var express = require('express');
var app = require('express')();

app.set('port', process.env.PORT || 9487);// 設定環境port
//var path = require('path');
var http = require('http').Server(app);
//var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser.json());  //解析post內容


//可以使用其他位置的物件
//var firebase = require('./firebase.js');
 var routers = require('./routers.js');

routers.setRequestUrl(app);
//firebase 基本推播
//firebase.firebase_start();

http.listen(app.get('port'), '0.0.0.0', function () {
    console.log("The server started in " + '127.0.0.1:' + app.get('port'));
    console.log('---------------------------------------');
});
