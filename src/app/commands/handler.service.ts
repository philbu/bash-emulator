import { Injectable } from '@angular/core';
import { CommandService } from './command.service';
import { Command } from './command';

import { FilesystemService } from './../files/filesystem.service';
import { OutputService } from './../output/output.service';

import { WhoamiService } from './../services/whoami.service';
import { WService } from './../services/w.service';
import { UptimeService } from './../services/uptime.service';
import { UnameService } from './../services/uname.service';
import { EchoService } from './../services/echo.service';

@Injectable({
  providedIn: 'root'
})
export class HandlerService {

  constructor() { }

  getAutocomplete(query: string){

  }

  execute(query: string): number{
    const command: Command = CommandService.split(query);
    switch(command.name){
      case '': OutputService.println(''); break;
      case 'cat': return FilesystemService.cat(command);
      case 'clear': OutputService.clear(); return 0;
      case 'echo': return EchoService.echo(command);
      case 'ls': return FilesystemService.ls(command);
      case 'mkdir': return FilesystemService.mkdir(command);
      case 'touch': return FilesystemService.touch(command);
      case 'uname': return UnameService.uname(command);
      case 'uptime': return UptimeService.uptime(command);
      case 'w': return WService.w(command);
      case 'whoami': return WhoamiService.whoami(command);
      default: OutputService.println(`bash: `+command.name+`: command not found`); return 1;
    }
    return 0;
  }
}
