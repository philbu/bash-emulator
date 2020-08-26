import { Command } from '../services/commands/command';
import { InitService } from '../services/init.service';
import { ValidationResponse, FunctionResponse } from '../types/types';
import { File } from '../services/files/file';
import { whoami as whoamiDescription} from '../services/files/content/home';

import * as moment from 'moment';

const validCommands = [
  'cal', 'clear', 'date', 'df', 'man', 
  'uname', 'uptime', 'w',
  'whereis', 'whoami', 'which',
]

const validShortFlags = {
  cal: [],
  date: [],
  df: [],
  finger: [],
  man: [],
  uname: ['a','s','n','r','v','m','p','i','o'],
  uptime: [],
  w: [],
  whereis: [],
  whoami: [],
  which: []
}
const validLongFlags = {
  cal: ['help'],
  date: ['help'],
  df: ['help'],
  finger: ['help'],
  man: ['help'],
  uname: ['help','all', 'kernel-name', 'nodename', 
  'kernel-release', 'kernel-version', 'machine', 
  'processor', 'hardware-platform', 'operating-system'],
  uptime: ['help'],
  w: ['help'],
  whereis: ['help'],
  whoami: ['help'],
  which: ['help']
}

const help = 'TODO'

function println(output: string) {
  InitService.outputService.println(output);
}

export function isValidSystemCommand(command: Command) {
  return validCommands.includes(command.name);
}

function date(command: Command): number {
  // validate flags
  let res: ValidationResponse = command.validateWith(validShortFlags.date, validLongFlags.date);
  if (!res.valid) {
    println(res.desc);
    return 1;
  }
  // interpret flags
  if (command.longFlags.includes('help')) {
    println(help);
    return 0;
  }
  // execute
  let responseCode = 0;
  InitService.outputService.println(moment().format('ddd MMM D hh:mm:ss A zz YYYY'));
  return responseCode;
}

function man(command: Command): number {
  // validate flags
  let res: ValidationResponse = command.validateWith(validShortFlags.man, validLongFlags.man);
  if (!res.valid) {
    println(res.desc);
    return 1;
  }
  // interpret flags
  if (command.longFlags.includes('help')) {
    println(help);
    return 0;
  }
  // execute
  if (command.nonFlagArgs.length !== 1) {
    InitService.outputService.println('man: for now only one argument is possible');
    return 1;
  }
  let fileString = command.nonFlagArgs[0];
  let response = InitService.filesystemService.getStartDirectory(fileString).cd(fileString);
  if (response.code === 0) {
    InitService.filesystemService.currentDir = response.output as File;
  } else {
    InitService.outputService.println(response.output as string);
  }
  return response.code;
}

function whoami(command: Command): number {
  // validate flags
  let res: ValidationResponse = command.validateWith(validShortFlags.whoami, validLongFlags.whoami);
  if (!res.valid) {
    println(res.desc);
    return 1;
  }
  // interpret flags
  if (command.longFlags.includes('help')) {
    println(help);
    return 0;
  }
  // execute
  let responseCode = 0;
  let whoamiText = `${InitService.userService.user.getName()}<br />
  <br />${whoamiDescription}`
  InitService.outputService.println(whoamiText);
  return responseCode;
}

function uname(command: Command): number {
  // validate flags
  let res: ValidationResponse = command.validateWith(validShortFlags.uname, validLongFlags.uname);
  if (!res.valid) {
    println(res.desc);
    return 1;
  }
  // interpret flags
  if (command.longFlags.includes('help')) {
    println(help);
    return 0;
  }
  // execute
  // a|all s|kernel-name n|nodename r|kernel-release v|kernel-version m|machine p|processor i|hardware-platform o|operating-system
  let unameInfo = ['Linux', 'bash', '5.4.0-40-generic', '#44-Ubuntu SMP Tue Jun 23 00:01:04 UTC 2020', 'x86_64', 'x86_64', 'x86_64', 'GNU/Linux']
  let responseCode = 0;
  if (command.shortFlags.includes('a')) {
    InitService.outputService.println(unameInfo.join(' '));
    return responseCode;
  }
  if (command.shortFlags.includes('s')||command.longFlags.includes('kernel-name')) {
    InitService.outputService.print(unameInfo[0]+' ');
  }
  if (command.shortFlags.includes('n')||command.longFlags.includes('nodename')) {
    InitService.outputService.print(unameInfo[1]+' ');
  }
  if (command.shortFlags.includes('r')||command.longFlags.includes('kernel-release')) {
    InitService.outputService.print(unameInfo[2]+' ');
  }
  if (command.shortFlags.includes('v')||command.longFlags.includes('kernel-version')) {
    InitService.outputService.print(unameInfo[3]+' ');
  }
  if (command.shortFlags.includes('m')||command.longFlags.includes('machine')) {
    InitService.outputService.print(unameInfo[4]+' ');
  }
  if (command.shortFlags.includes('p')||command.longFlags.includes('processor')) {
    InitService.outputService.print(unameInfo[5]+' ');
  }
  if (command.shortFlags.includes('i')||command.longFlags.includes('hardware-platform')) {
    InitService.outputService.print(unameInfo[6]+' ');
  }
  if (command.shortFlags.includes('o')||command.longFlags.includes('operating-system')) {
    InitService.outputService.print(unameInfo[7]+' ');
  }
  InitService.outputService.println('');
  return responseCode;
}

export function systemCommandexecute(command: Command) {
  switch(command.name) {
    case 'clear': InitService.outputService.clearOutput(); return 0;
    case 'date': return date(command);
    //case 'man': return man(command);
    case 'uname': return uname(command);
    //case 'w': return man(command);
    case 'whoami': return whoami(command);
    default: InitService.outputService.println('This command is not available yet.'); return 0;
  }
}