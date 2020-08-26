import { ValidationResponse } from '../../types/types';

export class Command {
  name: string;
  shortFlags: string[]; // UNIX-Style
  longFlags: string[];  // GNU-Style
  nonFlagArgs: string[];
  args: string[];

  constructor(command: string) {
    let commandParts = command.replace(/^\s+/g, '').split(' ');
    // command name is the first non white-space word
    this.name = commandParts[0];
    // arguments are all after the command name
    this.args = commandParts.slice(1);
    // filter short, long and non flag arguments
    this.shortFlags = this.args.filter(argument => /^-[^-]+/.test(argument)).flatMap(argument => argument.replace(/^-/, '').split(''));
    this.longFlags = this.args.filter(argument => /^--[^-]+/.test(argument)).map(argument => argument.replace(/^--/, ''))
    this.nonFlagArgs = this.args.filter(argument => !(/^(-|--)[^-]+/.test(argument)));
  }

  validateWith(validShortFlags: string[], validLongFlags: string[]): ValidationResponse {
    if (this.shortFlags.length > 0) {
      // if errorFlag is undefined every flag was valid
      let errorFlag = this.shortFlags.find(flag => !validShortFlags.includes(flag));
      if (errorFlag !== undefined) {
        return { valid: false, desc: `invalid option -- '${errorFlag}'`};
      }
    }
    if (this.longFlags.length > 0) {
      // if errorFlag is undefined every flag was valid
      let errorFlag = this.longFlags.find(flag => !validLongFlags.includes(flag));
      if (errorFlag !== undefined) {
        return { valid: false, desc: `unrecognized option '${errorFlag}'`};
      }
    }
    return { valid: true };
  }
}
