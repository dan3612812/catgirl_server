Introduce
====

This project use mqtt communication server & clinet(APP).
Clinet to judgment and process.Server also listen messages
and receive specific message todo something and publish message to this topic.

----

How to start server?
1. command `npm install`
2. command `npm test` or `node src/server.js`

if your server start success you can see this log

    The server started in 127.0.0.1:9487
    ---------------------------------------


`注意事項`

1. 文章內<android_id>透過get/url/uid 取得
2. 如未修改mqtt url 請在本機端安裝mqtt並啟用(src/mqtt.js:2)
3. 當然你的電腦需要安裝`Node.js`
4. This author is Taiwanese so english is poor 
5. app is here https://github.com/love1314524/BeadGame/ is by my friends 




------get-------
====
`127.0.0.1:9487/test`   //測試系統是否存活

#回傳值

    hello server is survival

`127.0.0.1:9487/uid`    //取得android_id

#回傳值

    {
        "id":"<android_id>"   //取得android_id
    }

----
`127.0.0.1:9487/roomlist`   //取得房間列表

#回傳值

    [
        {
            "roomname":"p1",    //遊戲名稱與 player1 相同
            "player1":"p1",     //player1的 android_id
            "player2":"p2",     //player2的 android_id
            "playcou":0,        //該房間人數
            "p1status":4,       //player1的狀態|0:待機 1:準備中,2:開始,3:斷線,4:戰鬥中,5:結束
            "p2status":4        //player2的狀態|0:待機 1:準備中,2:開始,3:斷線,4:戰鬥中,5:結束
        },
        {object}...             //可再新增含有以上key的物件
    ]

------post------
=========

`注意事項`

1. 底下post方式 請 header 加上 Content-Type ,Json
2. 請在body內塞入Json

`127.0.0.1:9487/createroom`     //創建房間
    
    {
        "id":"<android_id>"     //使用android_id 當作mqtt的topic EX:"catgirl/room/<android_id>"
    }

#response 
1. `error` 創建房間失敗，可能原因`id值為undefined`
2. `repeat` 創建房間失敗，可能原因`重複ID`
3. `success` 創建房間成功
    
----
`127.0.0.1:9487/joinroom`       //加入現有房間
    
    {
        "roomid":"<android_id>",      //房主的android_id
        "id":"<androdi_id>"           //自己的android_id
    }
    
#response 
1. `error` 加入房間失敗，可能原因`無此roomid`,`id值為undefind`
2. `full` 房間已滿(人數最多2人)  
3. `success` 創建房間成功  

----
`127.0.0.1:9487/mqttpub`        //由server代發送MQTT

    {
        "topic":'catgirl/room/<android_id>',     //房主的mqtt topic 預設 catgirl/room/android_id
        "message":'msg'                          // 預傳送訊息
    }

----

------server--------
=========
房間 json 格式

    {
        'roomname': 'test',   //房名 用android id     
        'player1': 'p1',    //創房名的 andorid id 同上
        'player2': 'p2',    //第二個加入的玩家  
        'playcou': 0,       //用戶數  當創建好房間時 已加1
        'p1status': 0,      //玩家1的狀態 |0:待機 1:準備中,2:開始,3:斷線,4:戰鬥中,5:結束
        'p2status': 0       //玩家2的狀態 |0:待機 1:準備中,2:開始,3:斷線,4:戰鬥中,5:結束
    }

`注意事項`

1. 需先exports.rinfo 才能呼叫`mqtt.js` 否則`mqtt.js`裡的rinfo 會無資料
2. 在`mqtt.js` 直接改變rinfo 請呼叫在`controller.js`的`chrinfo`支援兩種呼叫詳情請看下方6. 7.
3. 7=='7' ture
4. roomname將採用創立房間的id 將與player1的值一樣
5. 如有mqtt訊息`"command"`的值有問題請參考下面 mqtt - server封包command指令
6. chrinfo(room_serial,object) 修改rinfo[room_serial]的物件
7. chrinfo(room_serial,key,value) 修改rinfo[room_serial].key=value 單一格值

------MQTT--------
=========
mqtt message format

#json

    {
        'id':"<android_id>",  //發送端的 andorid_id
        'status':"0",       // |0:待機 1:準備中,2:開始,3:斷線,4:戰鬥中 
        "command":"start",  //此key只由server傳送  start:開始戰鬥,echo:轉傳訊息,end:遊戲結束
        ...                 //由clinet自行串接下去
    }

----

client封包status意思

當`status=1`時 `使用者準備` server將更改使用者的狀態為1當雙方的status都為"1"時server將傳送`"command":"start"`代表開始遊戲

當`status=0`時 `取消準備` 此時另一個玩家的status不能為"2"

當`status=3`時 `房主離開房間` 將該房間移除並透過mqtt通知該房間已被刪除 訊息格式JSON其中包含`"command":"leave"`

當`status=4`時 `戰鬥訊息echo` server將echo訊息並在該Json插入`"command":"echo"` JSON的key包含`"command"`的不在轉傳

當`status=5`時 `遊戲結束` server發送訊息在`同一個topic` 訊息格式JSON其中包含`"command":"end"`

當`status>6`時 `系統測試` 或非數字時為server內部測試用

----

server封包command指令

當`"command":"start"`時 server告知該房間開始遊戲        {qos:2}

當`"command":"end"`時 server告知該房間已結束遊戲        {qos:2}

當`"command":"leave"`時 server告知該房間房主已離開房間      {qos:2}

當`"command":"join"`時 server告知該房間有人進入 訊息格式JSON其中包含`"player": <android_id>`為新加入玩家的android_id       {qos:2}
