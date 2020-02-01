import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IpService {

  static ip_address: string = '';

  constructor() { }

  static getIP(){
    if (this.ip_address === ''){
      this.ip_address = (Math.floor(Math.random() * 255) + 1)+'.'+(Math.floor(Math.random() * 255) + 0)+'.'+(Math.floor(Math.random() * 255) + 0)+'.'+(Math.floor(Math.random() * 255) + 0);
    }
    return this.ip_address;
  }
}
