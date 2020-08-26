import { Group } from './group';

export class User {
  private name: string;
  private uid: number;
  private password: string;

  private group: Group;

  private info: string;

  private shell: string;
  private homedir: string;

  constructor(name: string, uid:number, group: Group = undefined){
    this.name = name;
    this.uid = uid;
    this.password = '';

    if(group === undefined){
      // if not defined create group with same name and uid
      this.group = new Group(this.name, this.uid);
    } else {
      this.group = group;
    }
    this.info = '';

    this.shell = '/bin/bash';
    this.homedir = `/home/${this.name}`;
  }

  //-Setter-------------------------------------------------------------------//
  setName(name: string, uid: number = undefined){
    this.name = name;
    if (uid != undefined){
      this.uid = uid;
    }
    return this;
  }

  setUid(uid: number){
    this.uid = uid;
    return this;
  }

  setPassword(password: string){
    this.password = password;
    return this;
  }

  setGroup(group: Group, gid: number = undefined){
    this.group = group;
    return this;
  }

  setInfo(info:string){
    this.info = info;
    return this;
  }

  setShell(shell: string){
    this.shell = shell;
    return this;
  }

  setHomeDir(homedir: string){
    this.homedir = homedir;
    return this;
  }
  //-End-Setter---------------------------------------------------------------//

  //-Getter-------------------------------------------------------------------//
  getName(){
    return this.name;
  }

  getUid(){
    return this.uid;
  }

  getGroup(){
    return this.group;
  }

  getInfo(){
    return this.info;
  }

  getShell(){
    return this.shell;
  }

  getHomeDir(){
    return this.homedir;
  }
  //-End-Getter---------------------------------------------------------------//

  checkPassword(password: string){
    return this.password === password;
  }

  toString(){
    // name:password:uid:gid:info:homedir:shell
    return `${this.name}:x:${this.uid}:${this.group.getGid()}:${this.info}:${this.homedir}:${this.shell}`
  }
}
