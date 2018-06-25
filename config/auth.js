module.exports = {

    'server': {
        'host': '127.0.0.1:9487',
        'name': 'test',
        'havethis': 'fuck5'
    },
    'mqtt': {
        'host': 'mqtt://127.0.0.1:1883',
        'name': 'raspberrypi'
    },
    'mqtt_will': {
        'topic': 'catgirl/server_log',
        'payload': '{"id":"server","command":"break"}',
        'qos': 2,
        'retain': false
    }
}