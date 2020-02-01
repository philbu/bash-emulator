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

  static split(command: string) {
    // https://stackoverflow.com/questions/18893390/splitting-on-comma-outside-quotes
    let array = command.split(/[\s]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
    const commandName = array[0];
    array = array.slice(1);
    const shortFlag = array.filter(part => /^-[^-]+/.test(part));
    const longFlag = array.filter(part => /^--[^-]*/.test(part));
    const other = array.filter(part => /^[^-].*/.test(part));
    return {
      'command_name': commandName,
      'short_flag': shortFlag,
      'long_flag': longFlag,
      'other': other
    };
  }
}
