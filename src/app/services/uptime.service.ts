import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { OutputService } from './../output/output.service';
import { Command } from './../commands/command';
import { CommandService } from './../commands/command.service';

@Injectable()
export class UptimeService {

  static help: string = `Usage:
uptime [options]

Options:
-p, --pretty   show uptime in pretty format
-h, --help     display this help and exit
-s, --since    system up since
-V, --version  output version information and exit

For more details see uptime(1).`;

  static version: string = `uptime from procps-ng 3.3.15`;

  constructor() { }

  static uptime(command: Command) {
    const time = moment("Jan 1 2020 04:01:07", "MMM DD YYYY hh:mm:ss");
    let duration = moment.duration(moment().diff(time));

    const validShortFlags = ['h', 'V', 'p', 's'];
    const validLongFlags = ['help', 'version', 'pretty', 'since'];
    const validation = CommandService.checkFlags(validShortFlags, validLongFlags, command);
    if (!validation.valid){
      OutputService.printWrong('uptime', validation.msg);
      return 1;
    }
    if (CommandService.longFlagExists('help', command)||CommandService.shortFlagExists('h', command)){
      OutputService.println(this.help);
      return 0;
    }
    if (CommandService.longFlagExists('version', command)||CommandService.shortFlagExists('V', command)){
      OutputService.println(this.version);
      return 0;
    }
    if (CommandService.longFlagExists('pretty', command)||CommandService.shortFlagExists('p', command)){
      OutputService.println(`up ${duration.days()} days, ${duration.minutes()} minutes, ${duration.seconds()} seconds`);
      return 0;
    }
    if (CommandService.longFlagExists('since', command)||CommandService.shortFlagExists('s', command)){
      OutputService.println(time.format('YYYY-DD-MM HH:mm:ss'));
      return 0;
    }
    OutputService.println(`${moment().format('HH:mm:ss')} up ${duration.days()} days, ${duration.hours()}:${duration.minutes()},  1 user,  load average: 0,00, 0,00, 0,00`);
    return 0
  }
}
