import { Command } from '../services/commands/command';
import { InitService } from '../services/init.service';
import { ValidationResponse, FunctionResponse } from '../types/types';
import { File } from '../services/files/file';

const validFileCommands = [
  'cat', 'cd', 'cp', 'head', 'ln', 
  'ls', 'mkdir', 'mv', 'pwd', 'rm',
  'tail', 'touch'
]

const validShortFlags = {
  cat: [],
  cd: [],
  cp: ['r'],
  head: [],
  ln: [],
  ls: ['l', 'a', 'h'],
  mkdir: [],
  mv: [],
  pwd: ['P', 'L'],
  rm: ['r'],
  tail: [],
  touch: [],
}
const validLongFlags = {
  cat: ['help'],
  cd: ['help'],
  cp: ['help'],
  head: ['help'],
  ln: ['help'],
  ls: ['help'],
  mkdir: ['help'],
  mv: ['help'],
  pwd: ['help'],
  rm: ['help'],
  tail: ['help'],
  touch: ['help'],
}

const help = 'TODO'

const man = 'TODO'

function println(output: string) {
  InitService.outputService.println(output);
}

export function isValidFileCommand(command: Command) {
  return validFileCommands.includes(command.name);
}

function cat(command: Command): number {
  // validate flags
  let res: ValidationResponse = command.validateWith(validShortFlags.cat, validLongFlags.cat);
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
  command.nonFlagArgs.forEach(file => {
    let response: FunctionResponse = InitService.filesystemService.getStartDirectory(file).cat(file);
    InitService.outputService.println(response.output as string);
    responseCode = response.code > responseCode ? response.code : responseCode;
  })
  return responseCode;
}

function cd(command: Command): number {
  // validate flags
  let res: ValidationResponse = command.validateWith(validShortFlags.cd, validLongFlags.cd);
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
  if (command.nonFlagArgs.length > 1) {
    InitService.outputService.println('cd: too many arguments');
    return 1;
  }
  // if no argument then go to home
  let fileString = command.nonFlagArgs[0] || '~/';
  let response = InitService.filesystemService.getStartDirectory(fileString).cd(fileString);
  if (response.code === 0) {
    InitService.filesystemService.currentDir = response.output as File;
  } else {
    InitService.outputService.println(response.output as string);
  }
  return response.code;
}

function ls(command: Command): number {
  // validate flags
  let res: ValidationResponse = command.validateWith(validShortFlags.ls, validLongFlags.ls);
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
  if (command.nonFlagArgs.length === 0) {
    let response = InitService.filesystemService.getStartDirectory('./').ls(
      './', command.shortFlags.includes('l'), command.shortFlags.includes('a'), command.shortFlags.includes('h')
    );
    InitService.outputService.print(response.output as string);
    return response.code;
  }
  command.nonFlagArgs.forEach(file => {
    let response = InitService.filesystemService.getStartDirectory(file).ls(
      file, command.shortFlags.includes('l'), command.shortFlags.includes('a'), command.shortFlags.includes('h')
    );
    InitService.outputService.print(response.output as string);
    responseCode = response.code > responseCode ? response.code : responseCode;
  })
  return responseCode;
}

function mkdir(command: Command): number {
  // validate flags
  let res: ValidationResponse = command.validateWith(validShortFlags.mkdir, validLongFlags.mkdir);
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
  command.nonFlagArgs.forEach(file => {
    let response: FunctionResponse = InitService.filesystemService.getStartDirectory(file).mkdir(file);
    InitService.outputService.print(response.output as string);
    responseCode = response.code > responseCode ? response.code : responseCode;
  })
  return responseCode;
}

function touch(command: Command): number {
  // validate flags
  let res: ValidationResponse = command.validateWith(validShortFlags.touch, validLongFlags.touch);
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
  command.nonFlagArgs.forEach(file => {
    let response: FunctionResponse = InitService.filesystemService.getStartDirectory(file).touch(file);
    InitService.outputService.print(response.output as string);
    responseCode = response.code > responseCode ? response.code : responseCode;
  })
  return responseCode;
}

function rm(command: Command): number {
  // validate flags
  let res: ValidationResponse = command.validateWith(validShortFlags.rm, validLongFlags.rm);
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
  command.nonFlagArgs.forEach(file => {
    let response: FunctionResponse = InitService.filesystemService.getStartDirectory(file).rm(file, command.shortFlags.includes('r'));
    InitService.outputService.print(response.output as string);
    responseCode = response.code > responseCode ? response.code : responseCode;
  })
  return responseCode;
}

function pwd(command: Command): number {
  // validate flags
  let res: ValidationResponse = command.validateWith(validShortFlags.pwd, validLongFlags.pwd);
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
  let path = InitService.filesystemService.currentDir.getPath();
  if (path === '') path = '/';
  InitService.outputService.println(path);
  return responseCode;
}

function headAndTail(command: Command, head: boolean): number {
  // validate flags
  let res: ValidationResponse = command.validateWith(validShortFlags.rm, validLongFlags.rm);
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
  command.nonFlagArgs.forEach(file => {
    let response: FunctionResponse = InitService.filesystemService.getStartDirectory(file).headAndTail(file, head);
    InitService.outputService.println(response.output as string);
    responseCode = response.code > responseCode ? response.code : responseCode;
  })
  return responseCode;
}

export function fileCommandexecute(command: Command) {
  switch(command.name) {
    case 'cat': return cat(command);
    case 'cd': return cd(command);
    case 'head': return headAndTail(command, true);
    case 'ls': return ls(command);
    case 'mkdir': return mkdir(command);
    case 'pwd': return pwd(command);
    case 'touch': return touch(command);
    case 'tail': return headAndTail(command, false);
    case 'rm': return rm(command);
    default: InitService.outputService.println('This command is not available yet.'); return 0;
  }
}