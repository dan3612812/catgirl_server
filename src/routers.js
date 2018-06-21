exports.setRequestUrl = function (app) {
    var controller = require('../controller/controller.js');

    app.get('/test',controller.test); //server survival
    app.get('/roomlist',controller.roomlist);//get room list
    app.get('/uid',controller.uid); // get id
    app.post('/createroom',controller.createroom);// json(id)
    app.post('/joinroom',controller.joinroom);// json(roomid,id)
    //-------------test----------//
    app.post('/mqttpub',controller.mqttpub); //test post  json (topic,message)

}
