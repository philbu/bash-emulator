import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class UptimeService {

  constructor() { }

  static command(command) {
    const time = moment("Jan 1 2020 04:01:07", "MMM DD YYYY hh:mm:ss");
    let duration = moment.duration(moment().diff(time));
    const array = command.split(' ');
    if (array.indexOf('-h') >= 0 || array.indexOf('--help') >= 0){
      return this.help();
    } else if (array.indexOf('-p') >= 0 || array.indexOf('--pretty') >= 0) {
      return `up ${duration.days()} days, ${duration.minutes()} minutes, ${duration.seconds()} seconds`;
    } else if (array.indexOf('-s') >= 0 || array.indexOf('--since') >= 0) {
      return time.format('YYYY-DD-MM HH:mm:ss');
    } else if (array.indexOf('-V') >= 0 || array.indexOf('--version') >= 0) {
      return `uptime from procps-ng 3.3.15`;
    } 
    return `${moment().format('HH:mm:ss')} up ${duration.days()} days, ${duration.hours()}:${duration.minutes()},  1 user,  load average: 0,00, 0,00, 0,00`;
  }

  static help(){
    return `
Usage:
 uptime [options]

Options:
 -p, --pretty   show uptime in pretty format
 -h, --help     display this help and exit
 -s, --since    system up since
 -V, --version  output version information and exit

For more details see uptime(1).`;
  }
}
