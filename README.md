# Homebridge - LaMetric Time

make notificationswitches for LaMetric Time


Example config.json:
```
    "accessories": [
        {
            "name": "Hello",
            "host": "192.168.2.100",
            "apikey": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "notify_text": "hello from homekit",
            "notify_icon": "3061",
            "notify_sound": "dog",
            "notify_cycles": 3,
            "notify_repeat": 0,
            "accessory": "LaMetricTime"
        }
    ]
```
Icon ID'S visible here: https://developer.lametric.com/icons
More about possible values can for sound / cycles / repeat and so on can be found here: https://lametric-documentation.readthedocs.io/en/latest/reference-docs/device-notifications.html
