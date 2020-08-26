import { Command } from '../services/commands/command';
import { InitService } from '../services/init.service';
import { ValidationResponse, FunctionResponse } from '../types/types';
import { File } from '../services/files/file';

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
  <br />
  Who am I?<br /> 
  Hi, my name is Phil and I'm probably the reason why you visit <br />
  and use this site. Currently, I am a master's student in computer<br />
  science. I wrote this project in my free time and it helped me to<br />
  understand more about terminals. Did you know that e.g. Ctrl+M<br />
  and Ctrl+J are both a substitute for Enter? I did not. But now I <br />
  do. Did you know, that Linux files and directories are pretty <br />
  much the same? Well I've heard of it but now after an implementa-<br />
  tion, I've learned more. Did you know that -d is a flag in UNIX<br />
  style while --d is a flag in GNU style? And many more... <br />
  <br />
  <br />
  If you are interested, here are some of my projects:<br />
  <br />
  * You are currently using this one. This is an emulated bash <br />
  console written in typescript using the angular framework. For<br />
  more information please refer to the README.md in your home <br />
  directory or visit <a href="https://github.com/philbu/bash-emulator">https://github.com/philbu/bash-emulator</a><br />
  * I've been developing an Android App which allows you to only<br />
  play the audio of YouTube videos. Basically, a music app with<br />
  a search, favorites, settings and a side-loader for updates. I'm<br />
  currently planning to make the code base open-source but I did<br />
  not find the time to clean up / anonymize my server address. If<br />
  you are interested in using it: <a href="https://app.sensadir.de/">https://app.sensadir.de/</a><br />
  * Labyrinth Bash game. A labyrinth game written entirely in bash.<br />
  Maybe not the most efficient language for a game, but I was <br />
  interested what I can do with reprinting existing output in a <br />
  terminal. For more information please visit <br />
  <a href="https://github.com/philbu/bashgame">https://github.com/philbu/bashgame</a>`
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