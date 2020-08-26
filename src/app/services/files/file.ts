import { User } from './../user/user';

import * as moment from 'moment';
import { UserService } from '../user/user.service';
import { OutputService } from '../output.service';
import { FunctionResponse } from 'src/app/types/types';

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

  constructor(
    private userService: UserService,
    name: string,
    directory: boolean = false,
    parent:File = undefined,
    owner: User = userService.getRoot(),
    mom: any = moment()
    ){
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

  getPath(): string{
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

  getFileByName(name: string): File{
    if (name === '') {
      return this;
    }
    const regex = new RegExp(`^${this.escapeForRegex(name)}$`);
    let filtered = this.files.filter(file => regex.test(file.name));
    if (filtered.length > 0) return filtered[0];
    return undefined;
  }

  fileExists(name: string){
    return this.getFileByName(name) != undefined;
  }

  getDirectory(path: string[]): File | undefined {
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
    if (parent.owner === this.userService.user) {
      output = output || ((parent.permissions[0] & permission) != 0);
    }
    if (parent.owner.getGroup() === this.userService.user.getGroup()) {
      output = output || ((parent.permissions[1] & permission) != 0);
    }
    output = output || ((parent.permissions[2] & permission) != 0);
    return output;
  }

  convertToPath(pathString: string): string[] {
    let path = pathString.split('/');
    // if root, home or . is start directory
    if (path[0] === '' || path[0] === '~' || path[0] === '.') {
      path = path.slice(1);
    }
    // remove last element after / if empty
    if (path.slice(-1)[0] === '') {
      path = path.slice(0, -1);
    }
    return path;
  }

  getLinesOfContent(file: File, lines: number, head:boolean) {
    if (head) {
      return file.content.split(/<br( |)\/>/).slice(0, lines).join('<br />')
    } else {
      return file.content.split(/<br( |)\/>/).slice(-lines).join('<br />')
    }
  }

  cat(name: string): FunctionResponse{
    let path = this.convertToPath(name);
    let parentDir = this.getDirectory(path);
    if (parentDir === undefined) {
      return { code: 1, output: `cat: ${name}: No such file or directory`};
    }
    if (parentDir.isDirectory()) {
      return { code: 1, output: `cat: ${name}: Is a directory`};
    }
    if (!this.hasPermission(parentDir, 0b100)){
      return { code: 1, output: `cat: ${name}: Permission denied`};
    }
    return { code: 0, output: parentDir.content};
  }

  cd(name: string): FunctionResponse {
    let path = this.convertToPath(name);
    let parentDir = this.getDirectory(path);
    if (parentDir === undefined) {
      return { code: 1, output: `cd: ${name}: No such file or directory`};
    }
    if (!parentDir.isDirectory()){
      return { code: 1, output: `cd: ${name}: Not a directory`};
    }
    return { code: 0, output: parentDir};
  }

  headAndTail(name: string, head: boolean): FunctionResponse {
    let path = this.convertToPath(name);
    let parentDir = this.getDirectory(path);
    if (parentDir === undefined) {
      return { code: 1, output: `${head?'head':'tail'}: ${name}: No such file or directory`};
    }
    if (parentDir.isDirectory()) {
      return { code: 1, output: `${head?'head':'tail'}: ${name}: Is a directory`};
    }
    if (!this.hasPermission(parentDir, 0b100)){
      return { code: 1, output: `${head?'head':'tail'}: ${name}: Permission denied`};
    }
    return { code: 0, output: this.getLinesOfContent(parentDir, 20, head)};
  }

  ls(name, long:boolean = false, hidden:boolean = false, human: boolean = false): FunctionResponse{
    let path = this.convertToPath(name);
    let dir = this.getDirectory(path);
    if (dir != undefined) {
      if (!this.hasPermission(dir, 0b100)){
        return { code: 1, output: `ls: cannot open directory '${name}': Permission denied<br/>`};
      }
      return { code: 0, output: dir.listFiles(long, hidden, human)};
    } else {
      return { code: 1, output: `ls: cannot access '${name}': No such file or directory<br/>`};
    }
  }

  mkdir(name): FunctionResponse {
    let path = this.convertToPath(name);
    let filename = path.pop();
    let parentDir = this.getDirectory(path);
    if (parentDir === undefined) {
      return { code: 1, output: `mkdir: cannot create directory ‘${name}’: No such file or directory<br />`};
    }
    if (this.fileExists(filename)) {
      return { code: 1, output: `mkdir: cannot create directory ‘${name}’: File exists<br />`};
    }
    if (!this.hasPermission(parentDir, 0b010)){
      return { code: 1, output: `mkdir: cannot create directory ‘${name}’: Permission denied<br />`};
    }
    new File(this.userService, filename, true).setOwner(this.userService.user).setParent(parentDir);
    return { code: 0, output: ''};
  }

  touch(name): FunctionResponse {
    let path = this.convertToPath(name);
    let filename = path.pop();
    let parentDir = this.getDirectory(path);
    if (parentDir === undefined) {
      return { code: 1, output: `touch: cannot touch ‘${name}’: No such file or directory<br />`};
    }
    if (this.fileExists(filename)) {
      return { code: 0, output: ''};
    }
    if (!this.hasPermission(parentDir, 0b010)){
      return { code: 1, output: `touch: cannot touch '${name}': Permission denied<br />`};
    }
    new File(this.userService, filename).setOwner(this.userService.user).setParent(parentDir);
    return { code: 0, output: ''};
  }

  rm(name, directory_allowed: boolean=false): FunctionResponse {
    let path = this.convertToPath(name);
    let filename = path.pop();
    let parentDir = this.getDirectory(path);
    if (parentDir === undefined) {
      return { code: 1, output: `rm: ${name}: No such file or directory<br />`};
    }
    if (!this.fileExists(filename)) {
      return { code: 1, output: `rm: ${name}: No such file or directory<br />`};
    }
    let file = parentDir.getFileByName(filename);
    if (!parentDir.hasPermission(file, 0b010)){
      return { code: 1, output: `rm: ${name}: Permission denied<br />`};
    }
    if (file.isDirectory() && !directory_allowed) {
      return { code: 1, output: `rm: cannot remove ${name}: Is a directory<br />`};
    }
    parentDir.remove(file);
    return { code: 0, output: ''};
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

  remove(removedFile: File){
    if (!this.isDirectory()) {
      return;
    }
    this.files = this.files.filter(x => x !== removedFile);
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
    let additional_long = '<table>';
    if (long){
      additional_long += this.toString(long, human, '.');
      if (this.parent == undefined){
        additional_long += this.toString(long, human, '..');
      } else {
        additional_long += this.parent.toString(long, human, '..');
      }
    }
    const reducer = (accumulator, currentValue) => accumulator + currentValue.toString(long, human);
    return additional_long + files.reduce(reducer, '')+ '</table>';
  }

  toString(long: boolean = false, human: boolean = true, name: string = '') {
    let output = '<tr><td>';
    if (long) {
      if (this.directory) {
        output += 'd';
      } else {
        output += '-';
      }
      output += this.getHumanPermissions();
      output += '</td><td>';
      output += this.links;
      output += '</td><td>';
      output += this.owner.getName();
      output += '</td><td>';
      output += this.owner.getGroup().getName();
      output += '</td><td>';
      if (human){
        output += this.humanFileSize(this.size);
      } else {
        output += this.size;
      }
      output += '</td><td>';
      output += this.timestamp.format('MMM');
      output += '</td><td>';
      output += this.timestamp.format('D');
      output += '</td><td>';
      output += this.timestamp.format('HH:mm');
      output += '</td><td>';
      if(name != ''){
        output += name;
      } else {
        output += this.name;
      }
      output += '</td></tr>';
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
    return s.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/, '.*');
  }
}
