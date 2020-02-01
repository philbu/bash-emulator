import { Injectable } from '@angular/core';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  constructor() { }

  static shortFlagExists(name: string, command: Command){
    for(let flag of command.shortFlags){
      if (flag.includes(name)){
        return true;
      }
    }
    return false;
  }

  static longFlagExists(name: string, command: Command){
    for(let flag of command.longFlags){
      if (flag === '--'+name){
        return true;
      }
    }
    return false;
  }

  static checkFlags(validShortFlags: string[], validLongFlags: string[], command: Command){
    if (validShortFlags.length > 0){
      const shortFlagRegex = RegExp(`^-(${validShortFlags.join('|')})+$`);
      for (let flag of command.shortFlags){
        if (!shortFlagRegex.test(flag)){
          return {valid: false, msg: `invalid option -- '${flag}'`};
        }
      }
    } else {
      if (command.shortFlags.length > 0){
        return {valid: false, msg: `invalid option -- '${command.shortFlags[0]}'`};
      }
    }

    if (validLongFlags.length > 0){
      const longFlagRegex = RegExp(`^--(${validLongFlags.join('|')})$`);
      for (let flag of command.longFlags){
        if (!longFlagRegex.test(flag)){
          return {valid: false, msg: `unrecognized option '${flag}'`};
        }
      }
    } else {
      if (command.longFlags.length > 0){
        return {valid: false, msg: `unrecognized option '${command.longFlags[0]}'`};
      }
    }

    // TODO: check `extra operand ´${item}´`;
    return { valid: true, msg:''};
  }

  static split(command: string): Command {
    // https://stackoverflow.com/questions/18893390/splitting-on-comma-outside-quotes
    let array = command.split(/[\s]+(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);

    const commandName = array[0];
    array = array.slice(1);
    const shortFlags = array.filter(part => /^-[^-]+/.test(part));
    const longFlags = array.filter(part => /^--[^-]*/.test(part));
    const other = array.filter(part => (shortFlags.indexOf(part)==-1) && (longFlags.indexOf(part)==-1));
    return {
      name: commandName,
      shortFlags: shortFlags,
      longFlags: longFlags,
      other: other
    };
  }
}
