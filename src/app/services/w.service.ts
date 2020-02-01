import { Injectable } from '@angular/core';
import { UptimeService } from './uptime.service';
import * as moment from 'moment';

import { OutputService } from './../output/output.service';
import { Command } from './../commands/command';
import { CommandService } from './../commands/command.service';
import { UserService } from './../user/user.service';
import { IpService } from './../connection/ip.service';

@Injectable()
export class WService {

  constructor() { }

  static w(command: Command){
    const ip_space = ' '.repeat(IpService.getIP().length -4);
    UptimeService.uptime(CommandService.split('uptime'))
    const output = `USER`+'\t'+`TTY      FROM`+ip_space+'\t'+`LOGIN@   IDLE   JCPU   PCPU WHAT
`+UserService.getUser().getName()+'\t'+`pts/0    `+IpService.getIP()+'\t'+moment().format('hh:mm')+`    0.00s  0.02s  0.00s w`;
    OutputService.println(output);
    return 0;
  }

  static man(){
    return `W(1)                                                       User Commands                                                      W(1)

NAME
       w - Show who is logged on and what they are doing.

SYNOPSIS
       w [options] user [...]

DESCRIPTION
       w displays information about the users currently on the machine, and their processes.  The header shows, in this order, the
       current time, how long the system has been running, how many users are currently logged on, and the  system  load  averages
       for the past 1, 5, and 15 minutes.

       The  following entries are displayed for each user: login name, the tty name, the remote host, login time, idle time, JCPU,
       PCPU, and the command line of their current process.

       The JCPU time is the time used by all processes attached to the tty.  It does not include past background  jobs,  but  does
       include currently running background jobs.

       The PCPU time is the time used by the current process, named in the "what" field.

COMMAND-LINE OPTIONS
       -h, --no-header
              Don't print the header.

       -u, --no-current
              Ignores  the username while figuring out the current process and cpu times.  To demonstrate this, do a "su" and do a
              "w" and a "w -u".

       -s, --short
              Use the short format.  Don't print the login time, JCPU or PCPU times.

       -f, --from
              Toggle printing the from (remote hostname) field.  The default as released is for the from field to not be  printed,
              although your system administrator or distribution maintainer may have compiled a version in which the from field is
              shown by default.

       --help Display help text and exit.

       -i, --ip-addr
              Display IP address instead of hostname for from field.

       -V, --version
              Display version information.

       -o, --old-style
              Old style output.  Prints blank space for idle times less than one minute.

       user   Show information about the specified user only.

ENVIRONMENT
       PROCPS_USERLEN
              Override the default width of the username column.  Defaults to 8.

       PROCPS_FROMLEN
              Override the default width of the from column.  Defaults to 16.

FILES
       /var/run/utmp
              information about who is currently logged on

       /proc  process information

SEE ALSO
       free(1), ps(1), top(1), uptime(1), utmp(5), who(1)

AUTHORS
       w was re-written almost entirely by Charles Blake, based on the version by  Larry  Greenfield  ⟨greenfie@gauss.rutgers.edu⟩
       and Michael K. Johnson ⟨johnsonm@redhat.com⟩

REPORTING BUGS
       Please send bug reports to ⟨procps@freelists.org⟩

procps-ng                                                    May 2012                                                         W(1)`
  }

}
