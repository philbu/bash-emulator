import { Injectable } from '@angular/core';

@Injectable()
export class EchoService {

  constructor() { }

  static command(string){
    return string.replace('echo ','',1).replace('"', '').replace('\'', '');
  }

}
