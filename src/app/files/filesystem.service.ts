import { Injectable } from '@angular/core';
import { File } from './file';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FilesystemService {

  static files: any[] = [
    // drwxrwxrwx','Oct', 'user group size month day hh:mm name
    // ls /
    ['drwxr-xr-x', '19', 'root', 'root', '4096', 'Oct', '18', '19:49', '/.'],
    ['drwxr-xr-x', '19', 'root', 'root', '4096', 'Oct', '18', '19:49', '/..'],
    ['drwxr-xr-x', '5', 'root', 'root', '4096', 'Oct', '18', '19:49', '/boot'],
    ['drwxr-xr-x', '5', 'root', 'root', '4096', 'Oct', '18', '19:49', '/bin'],
    ['drwxr-xr-x', '21', 'root', 'root', '4096', 'Oct', '18', '19:49', '/dev'],
    ['drwxr-xr-x', '96', 'root', 'root', '4096', 'Oct', '18', '19:49', '/etc'],
    ['drwxr-xr-x', '3', 'root', 'root', '4096', 'Oct', '18', '19:49', '/home'],
    ['lrwxrwxrwx', '1', 'root', 'root', '4096', 'Oct', '18', '19:49', '/lib'],
    ['drwxr-xr-x', '9', 'root', 'root', '4096', 'Oct', '18', '19:49', '/media'],
    ['drwxr-xr-x', '2', 'root', 'root', '4096', 'Oct', '18', '19:49', '/mnt'],
    ['drwxr-xr-x', '16', 'root', 'root', '4096', 'Oct', '18', '19:49', '/opt'],
    ['dr-xr-xr-x', '261', 'root', 'root', '4096', 'Oct', '18', '19:49', '/proc'],
    ['drwxr-x---', '14', 'root', 'root', '4096', 'Oct', '18', '19:49', '/root'],
    ['drwxr-xr-x', '24', 'root', 'root', '4096', 'Oct', '18', '19:49', '/run'],
    ['lrwxrwxrwx', '1', 'root', 'root', '4096', 'Oct', '18', '19:49', '/sbin'],
    ['drwxr-xr-x', '4', 'root', 'root', '4096', 'Oct', '18', '19:49 ', '/srv'],
    ['dr-xr-xr-x', '13', 'root', 'root', '4096', 'Oct', '18', '19:49', '/sys'],
    ['drwxrwxrwt', '29', 'root', 'root', '4096', 'Oct', '18', '19:49', '/tmp'],
    ['drwxr-xr-x', '12', 'root', 'root', '4096', 'Oct', '18', '19:49', '/usr'],
    ['drwxr-xr-x', '12', 'root', 'root', '4096', 'Oct', '18', '19:49', '/var'],
    // ls /home
    ['drwxr-xr-x', '3', 'root', 'root', '4096', 'Oct', '18', '19:49', '/home/.'],
    ['drwxr-xr-x', '19', 'root', 'root', '4096', 'Oct', '18', '19:49', '/home/..'],
    ['drwx------', '74', 'phil', 'phil', '4096', 'Oct', '18', '19:49', '/home/phil'],
  ]

  static regex = new RegExp('/', 'g');
  static root: File;
  static currentDir: File;

  constructor() {}

  private static _initialize = (() => {
    // "this" cannot be used here
    FilesystemService.root = new File('/', true);
    let home = new File('home', true).setParent(FilesystemService.root);
    new File('boot', true).setParent(FilesystemService.root);
    let phil = new File('phil', true).setParent(home);
    new File('.bashrc').setParent(phil).setContent('test');
    FilesystemService.currentDir = phil;
  })();

  static ls(folder){
    return this.currentDir.ls(true, true);
    folder = this.fixFolder(folder);
    let slashes = folder.match(this.regex).length;
    const reducer = (accumulator, currentValue) => accumulator + '<br>' + currentValue.join('\t');
    let now_files = this.files.filter(x => x[8].startsWith(folder) && x[8].match(this.regex).length == slashes);
    let output = now_files.reduce(reducer, '');
    return output;
  }

  static mkdir(folder, user, name){
    new File(name, true).setOwner(user, user).setParent(this.currentDir);
    return '';
  }

  static touch(folder, user, name){
    new File(name).setOwner(user, user).setParent(this.currentDir);
    return '';
  }

  static rmdir(folder, user, name){
    folder = this.fixFolder(folder);
    let filtered = this.files.filter(item => item[8] === folder+name);
    if (filtered.length == 0) return `rm: cannot remove '${name}': No such file or directory`;
    // TODO remove
    return '';
  }

  static fixFolder(folder){
    if (folder.startsWith('~/')){
      return folder.replace('~/', '/home/phil/');
    }
    if (folder.startsWith('~')){
      return folder.replace('~', '/home/phil/');
    }
    return folder;
  }
}
