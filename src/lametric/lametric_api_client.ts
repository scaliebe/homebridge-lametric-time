const http = require('http');

export class lametric_api_client {
    private readonly device_ip : String;
    private readonly api_auth : String;

    constructor(ip: String, apikey : string){
        this.device_ip = ip;
        this.api_auth = 'Basic ' + Buffer.from('dev:' + apikey).toString('base64');
    }

    public sendNotification(text : String, icon : String, sound: String, cycles: Number){

        var data = JSON.stringify({
            priority: 'warning', model: { cycles: cycles,  frames: [ { icon: icon, text : text } ] }
        });

        if(sound != null && sound != '')
            data = JSON.stringify({
                priority: 'warning', model: { cycles: cycles, frames: [ { icon: icon, text : text } ],
                    sound: { category: 'notifications', id: sound }
                }
            });
          
        const options = {
            hostname: this.device_ip,
            port: 8080,
            path: '/api/v2/device/notifications',
            method: 'POST',
            headers: {
                'Authorization' : this.api_auth,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = http.request(options, (res: any) => {
          
            res.on('data', (d: any) => {
              process.stdout.write(d)
            })
          })
          
          req.on('error', (error: any) => {
            console.error(error)
          })
          
          req.write(data)
          req.end()
    }
}