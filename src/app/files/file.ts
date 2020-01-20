import * as moment from 'moment';

export class File {
  directory: boolean;
  permissions: string;
  links: number;
  owner: string;
  group: string;
  size: number;
  timestamp: any;
  name: string;

  parent: File;
  files: File[];
  content: string;

  constructor(name: string, directory: boolean = false, parent:File = undefined, owner: string = 'root', group: string = 'root', mom: any = moment()){
    this.name = name;
    this.directory = directory;
    this.owner = owner;
    this.group = group;
    this.links = 1;
    if (this.directory) {
      this.size = 4096;
    } else {
      this.size = 0;
    }
    this.files = [];
    this.content = '';
    this.timestamp = mom;
    this.permissions = 'rwxr-xr-x';
    this.parent = parent;
  }

  setParent(parent:File){
    this.parent = parent;
    this.parent.addFile(this);
    return this;
  }

  setOwner(owner: string, group: string){
    this.owner = owner;
    this.group = group;
    return this;
  }

  setTimestamp(mom: any){
    this.timestamp = mom;
    return this;
  }

  setPermissions(permissions: string){
    this.permissions = permissions;
    return this;
  }

  get() {
    return this;
  }

  addFile(item: File){
    if (this.directory){
      this.files.push(item);
      return 0;
    }
    return 1;
  }

  followPath(path: string) {

  }

  ls(long: boolean = false, hidden: boolean = false) {
    if (this.directory){
      // list all files in directory
      return this.filesToString(this.filterFiles(hidden), long);
    } else {
      // list this file
      return this.toString(long);
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

  filesToString(files: File[], long: boolean = false){
    let additional_long = '';
    if (long){
      additional_long += this.toString(long, '.');
      if (this.parent == undefined){
        additional_long += this.toString(long, '..');
      } else {
        additional_long += this.parent.toString(long, '..');
      }
    }
    const reducer = (accumulator, currentValue) => accumulator  + currentValue.toString(long);
    return additional_long + files.reduce(reducer, '');
  }

  toString(long: boolean = false, name: string = '') {
    let output = '';
    if (long) {
      if (this.directory) {
        output += 'd';
      } else {
        output += '-';
      }
      output += this.permissions;
      output += '\t';
      output += this.links;
      output += '\t';
      output += this.owner;
      output += '\t';
      output += this.group;
      output += '\t';
      output += this.size;
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
}
