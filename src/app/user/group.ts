export class Group {
  private name: string;
  private gid: number;

  constructor(name: string, gid: number){
    this.name = name;
    this.gid = gid;
  }

  //-Setter-------------------------------------------------------------------//
  setName(name: string){
    this.name = name;
    return this;
  }

  setGid(gid: number){
    this.gid = gid;
    return this;
  }
  //-End-Setter---------------------------------------------------------------//

  //-Getter-------------------------------------------------------------------//
  getName(){
    return this.name;
  }

  getGid(){
    return this.gid;
  }
  //-End-Getter---------------------------------------------------------------//
}
