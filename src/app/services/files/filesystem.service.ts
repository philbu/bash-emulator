import { Injectable } from '@angular/core';
import { File } from './file';
import { UserService } from '../user/user.service';
import { bashrc, readme, whoami } from './content/home';

@Injectable({
  providedIn: 'root'
})
export class FilesystemService {
  regex = new RegExp('/', 'g');
  root: File;
  home: File;
  currentDir: File;

  constructor(userService: UserService) {
    this.root = new File(userService, '/', true);
    let home = new File(userService, 'home', true).setParent(this.root);
    new File(userService, 'boot', true).setParent(this.root);
    this.home = new File(userService, userService.user.getName(), true).setParent(home).setOwner(userService.user);
    new File(userService, '.bashrc').setParent(this.home).setContent(bashrc);
    new File(userService, 'README.md').setParent(this.home).setContent(readme);
    new File(userService, 'whoami.txt').setParent(this.home).setContent(whoami);
    this.currentDir = this.home;
  }

  get directory(){
    // if empty => we are in root
    if (this.currentDir.getPath() === '') {
      return '/'
    }
    return this.currentDir.getPath().replace(this.home.getPath(), '~');
  }

  /*cat(command: Command){
    const validShortFlags = [];
    const validLongFlags = ['help'];
    const validation = checkShortFlags(command, validShortFlags) && checkLongFlags(command, validLongFlags);
    if (!validation){
      InitService.outputService.println('cat: '+validation.msg+'\nTry \'cat --help\' for more information.');
      return 1;
    }
    if (CommandService.longFlagExists('help', command)){
      // TODO change help text;
      InitService.outputService.println('cat does not support any flags but \'--help\' yet.');
      return 0;
    }
    for(let file of command.other){
      if (this.getStartDirectory(file).cat(file) != 0){
        return 1;
      }
    }
    return 0;
  }

  ls(command: Command){
    const validShortFlags = ['l','a','h'];
    const validLongFlags = ['help'];
    const validation = CommandService.checkFlags(validShortFlags, validLongFlags, command);
    if (!validation.valid){
      InitService.outputService.println('ls: '+validation.msg+'\nTry \'ls --help\' for more information.');
      return 1;
    }
    if (CommandService.longFlagExists('help', command)){
      // TODO change help text;
      InitService.outputService.println('Use -l or -a or -h');
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

  mkdir(command: Command){
    const validShortFlags = [];
    const validLongFlags = ['help'];
    const validation = CommandService.checkFlags(validShortFlags, validLongFlags, command);
    if (!validation.valid){
      InitService.outputService.println('mkdir: '+validation.msg+'\nTry \'mkdir --help\' for more information.');
      return 1;
    }
    if (CommandService.longFlagExists('help', command)){
      // TODO change help text;
      InitService.outputService.println('mkdir does not support any flags but \'--help\' yet.');
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

  touch(command: Command){
    const validShortFlags = [];
    const validLongFlags = ['help'];
    const validation = CommandService.checkFlags(validShortFlags, validLongFlags, command);
    if (!validation.valid){
      InitService.outputService.println('touch: '+validation.msg+'\nTry \'touch --help\' for more information.');
      return 1;
    }
    if (CommandService.longFlagExists('help', command)){
      // TODO change help text;
      InitService.outputService.println('touch does not support any flags but \'--help\' yet.');
      return 0;
    }
    for(let file of command.other){
      this.getStartDirectory(file).touch(file);
    }
    return 0;
  }

  rm(folder, name){
    /*folder = this.fixFolder(folder);
    let filtered = this.files.filter(item => item[8] === folder+name);
    if (filtered.length == 0) return `rm: cannot remove '${name}': No such file or directory`;
    // TODO remove
    return '';
  }*/

  getStartDirectory(name): File{
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
