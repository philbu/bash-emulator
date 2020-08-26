import { Injectable } from '@angular/core';
import { InitService } from './init.service';
import { File } from './files/file';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {

  availableCommands = [
    'cat', 'cd', 'head', 'ls',
    'mkdir', 'pwd', 'touch', 'tail',
    'rm', '!!', 'clear', 'date', 
    'uname', 'whoami', 'echo', 'help'
  ].sort();

  constructor() { }

  getAutocomplete(command: string): string[] {
    // if command name exists and autocomplete for arguments needed
    if (command.match(/^(\s)*[^\s]+\s+.*/)) {
      let filename = command.split(' ').slice(-1)[0];
      // as File[] since we always start inside a directory
      let files = InitService.filesystemService.getStartDirectory(filename).getFiles() as File[];
      let filteredFiles: File[] = files.filter(file => file.name.startsWith(filename));
      return filteredFiles.map(file => file.name);
    } else {
      let commandName = command.replace(/^\s/, '');
      let filteredCommands = this.availableCommands.filter(com => com.startsWith(commandName));
      return filteredCommands;
    }
  }
}
