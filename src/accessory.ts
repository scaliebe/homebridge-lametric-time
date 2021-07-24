import { AccessoryConfig, AccessoryPlugin, API, Characteristic, CharacteristicEventTypes, CharacteristicGetCallback, CharacteristicSetCallback, CharacteristicValue, HAP, Logger, Logging, Service } from "homebridge";
import find from 'local-devices'
import { table } from "console";
import { lametric_api_client } from './lametric/lametric_api_client';

const https = require('https');
const axios = require('axios').default;

let hap: HAP;

export = (api: API) => {
  hap = api.hap;
  api.registerAccessory("LaMetricTime", LaMetricTime);
};

class LaMetricTime implements AccessoryPlugin{

  private readonly log: Logging;
  private readonly debug: boolean = false;

  private readonly name: string;
  private readonly host: string;
  private readonly apikey: string;

  private readonly informationService: Service;
  private readonly switchService: Service;

  private readonly lametricApi: lametric_api_client;

  private readonly notification_text: string;
  private readonly notification_icon: string;
  private readonly notification_sound: string;
  private readonly notification_cycles: number;
  private readonly notification_repeat: number;

  constructor(log: Logging, config: AccessoryConfig, api: API) {
    this.log = log;
    this.name = config.name;
    this.host = config.host;
    this.apikey = config.apikey;

    this.notification_text = config.notify_text;
    this.notification_icon = config.notify_icon;
    this.notification_sound = config.notify_sound;
    this.notification_cycles = config.notify_cycles;
    this.notification_repeat = config.notify_repeat;

    this.lametricApi = new lametric_api_client(this.host, this.apikey);

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, "in-Rech UG & Co. KG")
      .setCharacteristic(hap.Characteristic.Model, "LaMetric Time");

    this.switchService = new hap.Service.Switch(this.name);
    this.switchService.getCharacteristic(hap.Characteristic.On)
      .on(CharacteristicEventTypes.GET, this.getOnHandler.bind(this))  
      .on(CharacteristicEventTypes.SET, this.setOnHandler.bind(this));

    if(this.debug)
      this.log.debug('LaMetric Time Plugin Loaded');
  }

  getOnHandler(callback: any) {
    this.log.info('Getting switch state');
    callback(null, false);
  }

  setOnHandler(value: any, callback: any) {
    this.log.info('Setting switch state to:', value);

    this.lametricApi.sendNotification(
      this.notification_text, 
      this.notification_icon, 
      this.notification_sound,
      this.notification_cycles,
      this.notification_repeat);

    var that = this;
    setTimeout(() => that.switchService.updateCharacteristic('On', false), 100);
    callback(null);
  }

  getServices(): Service[] {
    return [
      this.informationService,
      this.switchService
    ];
  }

  identify(): void { }
}
