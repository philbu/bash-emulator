import { UserService } from './../user/user.service';
import { User } from './../user/user';
import { OutputService } from './../output/output.service';

import * as moment from 'moment';

export class File {
  directory: boolean;
  permissions: number[];
  links: number;
  owner: User;
  size: number;
  timestamp: any;
  name: string;

  parent: File;
  files: File[];
  content: string;

  constructor(name: string, directory: boolean = false, parent:File = undefined, owner: User = UserService.getRoot(), mom: any = moment()){
    this.name = name;
    this.directory = directory;
    this.owner = owner;
    this.links = 1;
    if (this.directory) {
      this.size = 4096;
    } else {
      this.size = 0;
    }
    this.files = [];
    this.content = '';
    this.timestamp = mom;
    // 4 read + 2 write + 1 exec
    this.permissions = [7,5,5];
    this.parent = parent;
  }

  //-Setter-------------------------------------------------------------------//
  setParent(parent:File){
    this.parent = parent;
    this.owner = parent.owner;
    this.parent.addFile(this);
    return this;
  }

  setOwner(owner: User){
    this.owner = owner;
    return this;
  }

  setTimestamp(mom: any){
    this.timestamp = mom;
    return this;
  }

  setPermissions(permissions: number[]){
    this.permissions = permissions;
    return this;
  }
  //-End-Setter---------------------------------------------------------------//

  getPath(){
    if (this.parent != undefined){
      return this.parent.getPath() + '/' + this.name;
    }
    return '';
  }

  addFile(item: File){
    if (this.directory){
      this.files.push(item);
      return 0;
    }
    return 1;
  }

  getFileByName(name: string){
    const regex = new RegExp(this.escapeForRegex(name)+'$');
    let filtered = this.files.filter(file => regex.test(file.name));
    if (filtered.length > 0) return filtered[0];
    return undefined;
  }

  fileExists(name: string){
    return this.getFileByName(name) != undefined;
  }

  getDirectory(path: string[]){
    if (path.length === 0){
      return this;
    }
    if (path[0] === '..'){
      if (this.parent != undefined){
        return this.parent.getDirectory(path.slice(1));
      } else {
        return this.getDirectory(path.slice(1));
      }
    }
    let file: File = this.getFileByName(path[0]);
    if (file === undefined){
      return undefined;
    }
    return file.getDirectory(path.slice(1));
  }

  getHumanPermissions(){
    let output = '';
    for(let num of this.permissions){
      output += ((num & 0b100) != 0) ? 'r' : '-';
      output += ((num & 0b010) != 0) ? 'w' : '-';
      output += ((num & 0b001) != 0) ? 'x' : '-';
    }
    return output;
  }

  hasPermission(parent: File, permission:number){
    let output = false;
    if (parent.owner === UserService.getUser()) {
      output = output || ((parent.permissions[0] & permission) != 0);
    }
    if (parent.owner.getGroup() === UserService.getUser().getGroup()) {
      output = output || ((parent.permissions[1] & permission) != 0);
    }
    output = output || ((parent.permissions[2] & permission) != 0);
    return output;
  }

  cat(name){
    let path = name.split('/');
    let filename = path.pop();
    if (filename == ''){
      filename = path.pop();
    }
    let parentDir = this.getDirectory(path);
    if (parentDir === undefined) {
      OutputService.println(`cat: ${name}: No such file or directory`);
      return 1;
    }
    if (!this.fileExists(filename)) {
      OutputService.println(`cat: ${name}: No such file or directory`);
      return 1;
    }
    let file = parentDir.getFileByName(filename);
    if (!this.hasPermission(file, 0b100)){
      OutputService.println(`cat: ${name}: Permission denied`);
      return 1;
    }
    OutputService.println(file.output);
    return 0;
  }

  ls(name, long:boolean = false, hidden:boolean = false, human: boolean = false){
    if (name.indexOf('/') == 0){
      name = name.substr(1);
    } else if (name.indexOf('~/') == 0){
      name = name.substr(2);
    }
    let path = name.split('/');
    if (path.length != 0){
      let filename = path.pop();
      if (filename != ''){
        path.push(filename);
      }
    }
    let dir = this.getDirectory(path);
    if (dir != undefined) {
      if (!this.hasPermission(dir, 0b100)){
        OutputService.println(`ls: cannot open directory '${name}': Permission denied`);
        return 1;
      }
      OutputService.println(dir.listFiles(long, hidden, human));
      return 0;
    } else {
      OutputService.println(`ls: cannot access '${name}': No such file or directory`);
      return 1;
    }
  }

  mkdir(name){
    if (name.indexOf('/') == 0){
      name = name.substr(1);
    } else if (name.indexOf('~/') == 0){
      name = name.substr(2);
    }
    let path = name.split('/');
    let filename = path.pop();
    if (filename == ''){
      filename = path.pop();
    }
    let parentDir = this.getDirectory(path);
    if (parentDir === undefined) {
      OutputService.println(`mkdir: cannot create directory ‘${name}’: No such file or directory`);
      return 1;
    }
    if (this.fileExists(filename)) {
      OutputService.println(`mkdir: cannot create directory ‘${name}’: File exists`);
      return 1;
    }
    if (!this.hasPermission(parentDir, 0b010)){
      OutputService.println(`mkdir: cannot create directory ‘${name}’: Permission denied`);
      return 1;
    }
    new File(filename, true).setOwner(UserService.getUser()).setParent(parentDir);
    OutputService.println('');
    return 1;
  }

  touch(name){
    let path = name.split('/');
    let filename = path.pop();
    if (filename == ''){
      filename = path.pop();
    }
    let parentDir = this.getDirectory(path);
    if (parentDir === undefined) {
      OutputService.println(`touch: cannot touch ‘${name}’: No such file or directory`);
      return 1;
    }
    if (this.fileExists(filename)) {
      OutputService.println('');
      return 0;
    }
    if (!this.hasPermission(parentDir, 0b010)){
      OutputService.println(`touch: cannot touch '${name}': Permission denied`);
      return 0;
    }
    new File(filename).setOwner(UserService.getUser()).setParent(parentDir);
    OutputService.println('');
    return 0;
  }

  rm(name, directory:boolean=false){
    let path = name.split('/');
    let filename = path.pop();
    if (filename == ''){
      filename = path.pop();
    }
    let parentDir = this.getDirectory(path);
    if (parentDir === undefined) {
      OutputService.println(`rm: ${name}: No such file or directory`);
      return 1;
    }
    if (!this.fileExists(filename)) {
      OutputService.println(`rm: ${name}: No such file or directory`);
      return 1;
    }
    //TODO fix permissions
    let file = parentDir.getFileByName(filename);
    if (!this.hasPermission(file, 0b100)){
      OutputService.println(`rm: ${name}: Permission denied`);
      return 1;
    }
    OutputService.println(file.output);
    return 0;
  }

  listFiles(long: boolean = false, hidden: boolean = false, human: boolean = false) {
    if (this.directory){
      // list all files in directory
      return this.filesToString(this.filterFiles(hidden), long, human);
    } else {
      // list this file
      return this.toString(long, human);
    }
  }

  setContent(content:string) {
    if (this.directory === true) return 1;
    this.content = content;
    this.size = content.length;
    return 0;
  }

  appendContent(content:string) {
    if (this.directory === true) return 1;
    this.content += content;
    return 0;
  }

  getFiles() {
    if (this.directory === true) return this.files;
    return this;
  }

  getContent() {
    return this.content;
  }

  isDirectory() {
    return this.directory;
  }

  isHidden() {
    return this.name.startsWith('.');
  }

  filterFiles(hidden: boolean = false) {
    if (!this.directory) return;
    if (hidden){
      return this.files;
    } else {
      return this.files.filter((file: File) => !file.isHidden());
    }
  }

  filesToString(files: File[], long: boolean = false, human: boolean = false){
    let additional_long = '';
    if (long){
      additional_long += this.toString(long, human, '.');
      if (this.parent == undefined){
        additional_long += this.toString(long, human, '..');
      } else {
        additional_long += this.parent.toString(long, human, '..');
      }
    }
    const reducer = (accumulator, currentValue) => accumulator  + currentValue.toString(long, human);
    return additional_long + files.reduce(reducer, '');
  }

  toString(long: boolean = false, human: boolean = true, name: string = '') {
    let output = '';
    if (long) {
      if (this.directory) {
        output += 'd';
      } else {
        output += '-';
      }
      output += this.getHumanPermissions();
      output += '\t';
      output += this.links;
      output += '\t';
      output += this.owner.getName();
      output += '\t';
      output += this.owner.getGroup().getName();
      output += '\t';
      if (human){
        output += this.humanFileSize(this.size);
      } else {
        output += this.size;
      }
      output += '\t';
      output += this.timestamp.format('MMM');
      output += '\t';
      output += this.timestamp.format('D');
      output += '\t';
      output += this.timestamp.format('HH:mm');
      output += '\t';
      if(name != ''){
        output += name;
      } else {
        output += this.name;
      }
      output += '\n';
      return output;
    } else {
      return this.name + '\t';
    }
  }


  /*
  https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
  */
  humanFileSize(bytes: number, si: boolean = true) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return Math.floor(bytes).toFixed(1)+' '+units[u];
  }

  escapeForRegex(s: string) {
    return s.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&');
  }
}
