module.exports = {

    'server': {
        'host': '192.168.0.138:9487',
        'name': 'test',
        'havethis': 'fuck5'
    },
    'mqtt': {
        'host': 'mqtt://192.168.2.2',
        'name': 'raspberrypi'
    },
    'mqtt_will': {
        'topic': 'catgirl/server_log',
        'payload': '{"id":"server","command":"break"}',
        'qos': 2,
        'retain': false
    }
}