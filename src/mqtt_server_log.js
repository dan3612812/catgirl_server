var clog = require('../config/clog');
var auth = require('../config/auth');
var mqtt = require('mqtt');
var tfn = "mqtt_log";
var client = mqtt.connect(auth.mqtt.host);

client.on('connect', function () {
    client.subscribe(auth.mqtt_will.topic);
    //client.publish(auth.mqtt_will.topic, "asdfasdf", { qos: 2 });
    //client.publish("catgirl/room/p1","{'id':'b2a0687c66b6','status':'4'}");
});

client.on('message', function (topic, message) {
    clog.log(tfn, message.toString(), 2);
});
console.log("\nMQTT_server_log is listen \n       ip:" + auth.mqtt.host);
console.log("       topic:" + auth.mqtt_will.topic);
console.log("---------------------------------------");