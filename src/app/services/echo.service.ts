import { Injectable } from '@angular/core';

import { OutputService } from './../output/output.service';
import { Command } from './../commands/command';
import { CommandService } from './../commands/command.service';

@Injectable()
export class EchoService {

  constructor() { }

  static echo(command: Command){
    const validShortFlags = [];
    const validLongFlags = [];
    const validation = CommandService.checkFlags(validShortFlags, validLongFlags, command);
    if (!validation.valid){
      OutputService.printWrong('whoami', validation.msg);
      return 1;
    }
    OutputService.println(command.other.join(' '));
    return 0
  }


}
