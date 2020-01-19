import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';

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

  constructor() { }

  static command(params){
    const array = params.split(' ');
    const res = GlobalService.is_valid(array.slice(-1), this.args);
    if (!res[0]){
      return `uname: ${res[1]}
Try 'uname --help' for more information.`
    }
    if (array.length > 1){
      if (array[1] === '--help'){
        return `Usage: uname [OPTION]...
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
} else if (array[1] === '--version' || array[1] === '--v') {
        return `uname (GNU coreutils) 8.31
Copyright (C) 2019 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Written by David MacKenzie.`;
} else if (array[1] === '--all' || array[1] === '-a') {
        return ``;
} else if (array[1] === '--kernel-name' || array[1] === '-s') {
        return ``;
} else if (array[1] === '--nodename' || array[1] === '-n') {
        return ``;
} else if (array[1] === '--kernel-release' || array[1] === '--v') {
        return ``;
} else if (array[1] === '--kernel-version' || array[1] === '--v') {
        return ``;
} else if (array[1] === '--machine' || array[1] === '--v') {
        return ``;
}
}
return `phil`;
  }

}
