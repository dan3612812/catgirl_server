how to use?
first  npm install
second npm test

------post------
=========

127.0.0.1:9487/createroom
    在 body內塞入json
    
    {
        "id":"id"     //android_id
    }
    
----
127.0.0.1:9487/joinroom
    在 body內塞入json
    
    {
        "roomid":"<android_id>",     //房主的android_id
        "id":"<androdi_id>"      //自己的android_id
    }
    
----
127.0.0.1:9487/mqttpub
    在 body內塞入json

    {
        "topic":'catgirl/room/'+<android_id>,     //房主的mqtt topic 預設 catgirl/room/android_id
        "message":msg      //自己的android id
    }

------server----
=========
房間 json 格式

    {
        'roomname': 'test',   //房名 用android id
        'player1': 'p1',    //創房名的 andorid id 同上
        'player2': 'p2',    //第二個加入的玩家
        'playcou': 0,       //用戶數  當創建好房間時 已加1
        'p1status': 0,      //玩家1的狀態 |0:待機 1:準備中,2:開始,3:斷線,4:戰鬥中
        'p2status': 0       //玩家2的狀態 |0:待機 1:準備中,2:開始,3:斷線,4:戰鬥中
    }


 ------MQTT--------
 =========
 mqtt message format
    json
    
    {
        'id':"<android_id>",  //發送端的 andorid_id
        'status':"0",       // |0:待機 1:準備中,2:開始,3:斷線,4:戰鬥中
        "command":"start",  //此key只由server傳送  start:開始戰鬥,echo:轉傳訊息
        ...             //由clinet 自行串接下去
    }

收到client封包時

    當 status:"1"時 server將更改使用者的狀態為"1" 
        -當雙方的status都為"1"時server將傳送 "command":"start" 代表開始遊戲

    當 status:"0"時 取消準備 此時另一個玩家的status不能為"2" 

    當 status:"4"時 server將轉傳該訊息並在該json插入"command":"echo" 而被插入過的不在轉傳
