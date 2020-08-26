import { Injectable } from '@angular/core';
import { InitService } from '../init.service';
import { Command } from './command';
import { isValidFileCommand, fileCommandexecute } from '../../commands/file-commands';
import { isValidSystemCommand, systemCommandexecute } from '../../commands/system-commands';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  help: string = `
  This is an emulation of a terminal running bash. It could communicate<br />
  directly with a real shell but shells can be escaped and security<br />
  compromised. I don't want that.<br />
  <br />
  How can you use it?<br />
  Basically, you can enter commands like in a real environment and<br />
  create(mkdir, touch) and remove(rm) files. You can read files using<br />
  \`cat <filename>\` and list files with \`ls [-lah]\`. Some commands<br />
  are not working yet. Many flags are not implemented yet.<br />`;

  constructor() { }

  commandNames: string[] = [
    // processes
    'ps', 'top', 'kill', 'bg', 'fg',
    // permissions
    'chmod',
    // searching
    'grep', 'find', 'locate',
  ]

  lastCommand = '';

  returnCode = 0;

  addCommandOutput(output: string) {
    InitService.outputService.addOutput(output);
  }

  hasQuotes(command: string) {
    //command.match(/^([^"|^']*"[^"]*"[^"|^']*|[^"|^']*'[^']*'[^"|^']*)*$/);
    return command.includes('\'') || command.includes('"');
  }

  interpretCommand(commandString: string) {
    this.lastCommand = commandString;
    // check for quotes
    if (this.hasQuotes(commandString)){
      this.addCommandOutput('bash-emulator: quotes are not supported yet<br />');
      return;
    }
    // TODO process quotes
    // split by ;
    if (commandString.includes(';')){
      commandString.split(';').map(x => this.interpretCommand(x));
      return;
    }
    // TODO parse special operators <(), |, etc
    // TODO parse variables with $
    // Split command into arguments and name
    let command: Command = new Command(commandString);
    if (isValidFileCommand(command)) {
      return fileCommandexecute(command);
    }

    if (isValidSystemCommand(command)) {
      return systemCommandexecute(command);
    }

    this.returnCode = 0;
    switch(command.name) {
      case 'echo': InitService.outputService.println(command.args.join(' ')); break;
      case 'help': InitService.outputService.println(this.help); break;
      case '': break;
      case '!!': this.interpretCommand(this.lastCommand); break;
      default: 
        this.addCommandOutput(`bash: ${command.name}: command not found<br />`); 
        this.returnCode = 127;
        break;
    }
    return this.returnCode;
  }

}
