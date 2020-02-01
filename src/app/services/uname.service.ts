import { Injectable } from '@angular/core';

import { OutputService } from './../output/output.service';
import { Command } from './../commands/command';
import { CommandService } from './../commands/command.service';

@Injectable()
export class UnameService {

  static args: any[] = [
    '--help',
    '--v', '--version',
    '-a', '--all',
    '-s', '--kernel-name',
    '-n', '--nodename',
    '-r', '--kernel-release',
    '-v', '--kernel-version',
    '-m', '--machine',
    '-p', '--processor',
    '-i', '--hardware-platform',
    '-o', '--operating-system'
  ]

  static help: string = `Usage: uname [OPTION]...
Print certain system information.  With no OPTION, same as -s.

-a, --all                print all information, in the following order,
                       except omit -p and -i if unknown:
-s, --kernel-name        print the kernel name
-n, --nodename           print the network node hostname
-r, --kernel-release     print the kernel release
-v, --kernel-version     print the kernel version
-m, --machine            print the machine hardware name
-p, --processor          print the processor type (non-portable)
-i, --hardware-platform  print the hardware platform (non-portable)
-o, --operating-system   print the operating system
--help     display this help and exit
--version  output version information and exit

GNU coreutils online help: <https://www.gnu.org/software/coreutils/>
Full documentation <https://www.gnu.org/software/coreutils/uname>
or available locally via: info '(coreutils) uname invocation'`;

  static version: string = `uname (GNU coreutils) 8.31
Copyright (C) 2019 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Written by David MacKenzie.`;

  static content: string[] = ['Linux', 'TODO', 'TODO', 'TODO', 'TODO', 'TODO', 'TODO', 'TODO'];

  constructor() { }

  static uname(command: Command){
    const validShortFlags = ['a', 's' ,'n', 'r', 'v', 'm', 'p', 'i', 'o'];
    const validLongFlags = ['all', 'kernel-name', 'nodename',
      'kernel-release', 'kernel-version', 'machine', 'processor',
      'hardware-platform', 'operating-system', 'help', 'version'];
    const validation = CommandService.checkFlags(validShortFlags, validLongFlags, command);
    if (!validation.valid){
      OutputService.printWrong('uname', validation.msg);
      return 1;
    }
    if (CommandService.longFlagExists('help', command)){
      OutputService.println(this.help);
      return 0;
    }
    if (CommandService.longFlagExists('version', command)){
      OutputService.println(this.version);
      return 0;
    }
    if (CommandService.longFlagExists('all', command)||CommandService.shortFlagExists('a', command)){
      OutputService.println(this.content.join(' '));
      return 0;
    }
    let output = '';
    // skip 'all', 'help', 'version'
    for (let i=1; i<validShortFlags.length; i++){
      if(CommandService.longFlagExists(validLongFlags[i], command)||CommandService.shortFlagExists(validShortFlags[i], command)){
        output += this.content[i];
      }
    }
    if(output === ''){
      output += this.content[0];
    }
    OutputService.println(output);
    return 0
  }

}
