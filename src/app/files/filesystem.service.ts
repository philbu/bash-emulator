import { Injectable } from '@angular/core';
import { UserService } from './../user/user.service';
import { CommandService } from './../commands/command.service';
import { Command } from './../commands/command';
import { OutputService } from './../output/output.service';
import { File } from './file';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FilesystemService {

  static regex = new RegExp('/', 'g');
  static root: File;
  static home: File;
  static currentDir: File;

  constructor() {}

  private static _initialize = (() => {
    // "this" cannot be used here
    FilesystemService.root = new File('/', true);
    let home = new File('home', true).setParent(FilesystemService.root);
    new File('boot', true).setParent(FilesystemService.root);
    FilesystemService.home = new File('phil', true).setParent(home).setOwner(UserService.getUser());
    new File('.bashrc').setParent(FilesystemService.home).setContent('test');
    FilesystemService.currentDir = FilesystemService.home;
  })();

  static getCurrentDirectory(){
    return this.currentDir.getPath().replace(this.home.getPath(), '~');
  }

  static cat(command: Command){
    const validShortFlags = [];
    const validLongFlags = ['help'];
    const validation = CommandService.checkFlags(validShortFlags, validLongFlags, command);
    if (!validation.valid){
      OutputService.println('cat: '+validation.msg+'\nTry \'cat --help\' for more information.');
      return 1;
    }
    if (CommandService.longFlagExists('help', command)){
      // TODO change help text;
      OutputService.println('cat does not support any flags but \'--help\' yet.');
      return 0;
    }
    for(let file of command.other){
      if (this.getStartDirectory(file).cat(file) != 0){
        return 1;
      }
    }
    return 0;
  }

  static ls(command: Command){
    const validShortFlags = ['l','a','h'];
    const validLongFlags = ['help'];
    const validation = CommandService.checkFlags(validShortFlags, validLongFlags, command);
    if (!validation.valid){
      OutputService.println('ls: '+validation.msg+'\nTry \'ls --help\' for more information.');
      return 1;
    }
    if (CommandService.longFlagExists('help', command)){
      // TODO change help text;
      OutputService.println('Use -l or -a or -h');
      return 0;
    }
    let isLong = CommandService.shortFlagExists('l', command);
    let isAll = CommandService.shortFlagExists('a', command);
    let isHuman = CommandService.shortFlagExists('h', command);
    let output = '';
    if (command.other.length === 0){
      return this.getStartDirectory('').ls('', isLong, isAll, isHuman);
    }
    if (command.other.length === 1){
      return this.getStartDirectory(command.other[0]).ls(command.other[0], isLong, isAll, isHuman);
    }
    for(let file of command.other){
      if(this.getStartDirectory(file).ls(file, isLong, isAll, isHuman) != 0){
        return 1;
      }
    }
    return 0;
  }

  static mkdir(command: Command){
    const validShortFlags = [];
    const validLongFlags = ['help'];
    const validation = CommandService.checkFlags(validShortFlags, validLongFlags, command);
    if (!validation.valid){
      OutputService.println('mkdir: '+validation.msg+'\nTry \'mkdir --help\' for more information.');
      return 1;
    }
    if (CommandService.longFlagExists('help', command)){
      // TODO change help text;
      OutputService.println('mkdir does not support any flags but \'--help\' yet.');
      return 0;
    }
    let output = 0;
    for(let file of command.other){
      if(this.getStartDirectory(file).mkdir(file) != 0){
        let output = 1;
      }
    }
    return output;
  }

  static touch(command: Command){
    const validShortFlags = [];
    const validLongFlags = ['help'];
    const validation = CommandService.checkFlags(validShortFlags, validLongFlags, command);
    if (!validation.valid){
      OutputService.println('touch: '+validation.msg+'\nTry \'touch --help\' for more information.');
      return 1;
    }
    if (CommandService.longFlagExists('help', command)){
      // TODO change help text;
      OutputService.println('touch does not support any flags but \'--help\' yet.');
      return 0;
    }
    for(let file of command.other){
      this.getStartDirectory(file).touch(file);
    }
    return 0;
  }

  static rm(folder, name){
    /*folder = this.fixFolder(folder);
    let filtered = this.files.filter(item => item[8] === folder+name);
    if (filtered.length == 0) return `rm: cannot remove '${name}': No such file or directory`;
    // TODO remove*/
    return '';
  }

  static getStartDirectory(name): File{
    if (name === ''){
      return this.currentDir;
    }
    if (name.startsWith('/')) {
      return this.root;
    }
    if (name.startsWith('~/')) {
      return this.home;
    }
    if (name.startsWith('./')) {
      return this.currentDir;
    }
    return this.currentDir;
  }

}
