how to use?
1.  npm install
2. npm test

------get-------
====

`127.0.0.1:9487/uid`
回傳值

    {
        "id":<android_id> //取得android_id
    }

----
`127.0.0.1:9487/roomlist`

    [
        {
            "roomname":"p1",    //遊戲名稱與 `player1` 相同
            "player1":"p1",     //player1的<android_id>
            "player2":"p2",     //player2的<android_id>
            "playcou":0,        //該房間人數
            "p1status":4,       //player1的狀態|0:待機 1:準備中,2:開始,3:斷線,4:戰鬥中,5:結束
            "p2status":4        //player2的狀態|0:待機 1:準備中,2:開始,3:斷線,4:戰鬥中,5:結束
        },
        {object}...            //可再新增同上物件
    ]

------post------
=========

`127.0.0.1:9487/createroom`
在 body內塞入json
    
    {
        "id":"id"     //android_id
    }
    
----
`127.0.0.1:9487/joinroom`
在 body內塞入json
    
    {
        "roomid":"<android_id>",     //房主的android_id
        "id":"<androdi_id>"      //自己的android_id
    }
    
----
`127.0.0.1:9487/mqttpub`
在 body內塞入json

    {
        "topic":'catgirl/room/'+<android_id>,     //房主的mqtt topic 預設 catgirl/room/android_id
        "message":msg      //自己的android id
    }

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
2. 在`mqtt.js` 直接改變rinfo 是指標在 `controller.js` 的rinfo 同一空間
3. 7=='7' ture
4. roomname將採用創立房間的id 將與player1的值一樣

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

----

client封包status意思

當`status=1`時 server將更改使用者的狀態為1當雙方的status都為"1"時server將傳送 "command":"start" 代表開始遊戲

當`status=0`時 取消準備 此時另一個玩家的status不能為2

當`status=4`時 server將轉傳該訊息並在該json插入`"command":"echo"` 而被插入過的不在轉傳

當`status=5`時 server將從rinfo移除該`topic`同名的roomname並發送訊息在`同一個topic` `"command":"end"`

當`status>6`或非以上數字時為server內部測試用