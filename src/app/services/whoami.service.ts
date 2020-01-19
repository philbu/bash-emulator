import { Injectable } from '@angular/core';

@Injectable()
export class WhoamiService {

  constructor() { }

  static command(parameter, user=''){
    const array = parameter.split(' ');
    if (array.length > 1){
      if (array[1] === '--help' || array[1] === '--h'){
        return `Usage: whoami [OPTION]...
Print the user name associated with the current effective user ID.
Same as id -un.

      --help     display this help and exit
      --version  output version information and exit

GNU coreutils online help: <https://www.gnu.org/software/coreutils/>
Full documentation <https://www.gnu.org/software/coreutils/whoami>
or available locally via: info '(coreutils) whoami invocation'`;
} else if (array[1] === '--version' || array[1] === '--v') {
        return `whoami (GNU coreutils) 8.31
Copyright (C) 2019 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Written by Richard Mlynarik.`;
} else if (array[1].startsWith('--')){
        return `whoami: unrecognized option '${array[1]}'
Try 'whoami --help' for more information.`;
} else if (array[1].startsWith('-')){
        return `whoami: invalid option -- '${array[1].replace('-', '')}'
Try 'whoami --help' for more information.`;
      } else {
        return 'whoami: extra operand ‘'+array[1]+'’<br>'+
        'Try \'whoami --help\' for more information.';
      }
    } else {
      return `phil

Who am I (kidding)? Hi my name is Phil and I'm probably the reason why you came
to my little site. Currently, I am a master's student in computer science.

Here are some of my projects:

  * You are currently using one. This is an emulated bash console written in
    typescript using the angular framework. For more information please refer to
    the README.md in my home directory
  * Hestia is a time management application written in Ionic 4. For more
    information visit <a href="https://hestia.pj-solutions.de">https://hestia.pj-solutions.de</a>
  * Labyrinth Bash game. A labyrinth game written entirely in bash. Maybe not
    the most efficient language, but I was interested what I can do with
    reprinting existing output in a terminal. For more information please refer
    to <a href="https://github.com/philbu/bashgame">https://github.com/philbu/bashgame</a>
`;
// TODO
    }
  }

  static man(){
    return `WHOAMI(1)                                                  User Commands                                                 WHOAMI(1)

NAME
       whoami - print effective userid

SYNOPSIS
       whoami [OPTION]...

DESCRIPTION
       Print the user name associated with the current effective user ID.  Same as id -un.

       --help display this help and exit

       --version
              output version information and exit

AUTHOR
       Written by Richard Mlynarik.

REPORTING BUGS
       GNU coreutils online help: <https://www.gnu.org/software/coreutils/>
       Report any translation bugs to <https://translationproject.org/team/>

COPYRIGHT
       Copyright  ©  2019  Free  Software  Foundation,  Inc.   License  GPLv3+:  GNU  GPL  version 3 or later <https://gnu.org/li‐
       censes/gpl.html>.
       This is free software: you are free to change and redistribute it.  There is NO WARRANTY, to the extent permitted by law.

SEE ALSO
       Full documentation <https://www.gnu.org/software/coreutils/whoami>
       or available locally via: info '(coreutils) whoami invocation'

GNU coreutils 8.31                                         November 2019                                                 WHOAMI(1)`;
  }

}
