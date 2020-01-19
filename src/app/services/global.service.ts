import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
  static is_valid(command_params:string[], args:string[]){
    // TODO if you want to combine params
    //let array = args.filter(x => /^-[^-].*/.test(x));
    //array = array.map(x => x.substr(1));
    //console.log(array);
    for (let item of command_params){
      if (args.indexOf(item) == -1){
        if (item.startsWith('--')) {
          return [false, `unrecognized option '${item}'`];
        } else if (item.startsWith('-')){
          return [false, `invalid option -- '${item}'`];
        } else {
          return [false, `extra operand ´${item}´`];
        }
      }
    }
    return [true, ''];
  }
}
