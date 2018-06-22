module.exports = {

    'server': {
        'host': '192.168.2.2:9487',
        'name': 'test',
        'havethis': 'fuck'
    },
    'mqtt': {
        'host': 'mqtt://192.168.2.28:1883',
        'name': 'raspberrypi'
    },
    'mqtt_will': {
        'topic': 'catgirl/server_log',
        'payload': '{"id":"server","command":"break"}',
        'qos': 2,
        'retain': false
    }
}