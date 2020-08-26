import { Component, Input, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HistoryService } from '../../services/history.service';
import { InitService } from '../../services/init.service';
import { CommandService } from '../../services/commands/command.service';
import { AutocompleteService } from 'src/app/services/autocomplete.service';

@Component({
  selector: 'app-command',
  templateUrl: './command.component.html',
  styleUrls: ['./command.component.scss']
})
export class CommandComponent {

  @Input() user: string;

  @Input() directory: string;

  domain: string = 'phil-buschmann.de';

  validInputs = [
    '\ ', '!', '"', '#', '$', '%', '&',
    '\'', '(', ')', '*', '+', ',', '-',
    '.', '/', '0', '1', '2', '3', '4',
    '5', '6', '7', '8', '9', ':', ';',
    '<', '=', '>', '?', '@', 'A', 'B',
    'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W',
    'X', 'Y', 'Z', '[', '\\', ']', '^',
    '`', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', '{',
    '|', '}', '~', '_', '´', '§', '^'
  ];

  horizontalMovement = ['ArrowLeft', 'ArrowRight'];

  verticalMovement = ['ArrowUp', 'ArrowDown'];

  ctrl = false;
  
  shift = false;

  search = false;

  caretPosition = 0;

  commandStart = '';
  commandMiddle = '';
  commandEnd = '';

  commandCut = '';

  tabCount = 0;

  constructor(private snackBar: MatSnackBar,
    private history: HistoryService, 
    private commandService: CommandService,
    private autocompleteService: AutocompleteService  
  ) { }

  get command() {
    return this.commandStart + this.commandMiddle + this.commandEnd;
  }

  get searchResult() {
    return this.history.searchCommand(this.commandStart);
  }

  clearCommand() {
    this.caretPosition = 0;
    this.commandStart = '';
    this.commandMiddle = '';
    this.commandEnd = '';
  }

  setCommand(command: string) {
    this.clearCommand();
    this.commandStart = command;
    this.caretPosition = this.commandStart.length;
  }

  updateCommand() {
    const tmpCommand = this.command;
    this.commandStart = tmpCommand.slice(0, this.caretPosition);
    this.commandMiddle = tmpCommand[this.caretPosition] || '';
    this.commandEnd = tmpCommand.slice(this.caretPosition+1);
  }

  moveCaret(key: string) {
    if (key === 'ArrowLeft') {
      // decrease position until 0
      this.caretPosition = Math.max(0, this.caretPosition-1);
    } else {
      // increase position until end
      this.caretPosition = Math.min(this.caretPosition+1, this.command.length);
    }
    this.updateCommand();
  }

  moveHistory(key: string) {
    if (key === 'ArrowUp') {
      // decrease position until 0
      this.setCommand(this.history.decreasePosition(this.command));
    } else {
      // increase position until end
      this.setCommand(this.history.increasePosition());
    }
  }

  onEnter(){
    if (!this.command.startsWith(' ')) {
      // put command in history
      this.history.addCommand(this.command.replace(/\s+$/g, ''));
    }
    let tmpCommand = this.command;
    // add command and line as output
    this.addCommandToOutput();
    // execute command
    this.commandService.interpretCommand(tmpCommand);
  }

  addCommandToOutput(clear: boolean = true) {
    let line = `<b><span class="user">${this.user}@${this.domain}</span>:<span class="folder">${this.directory}</span></b>$ ${this.command}<br />`;
    InitService.outputService.addOutput(line);
    if (clear) this.clearCommand();
  }

  checkKeyCombinations(keyCode: string, key: string) {
    if (this.shift) {
      // ctrl + shift combinations
      if (keyCode === 'KeyC') {
        // c - copy:
        document.execCommand('copy');
        return;
      }
      if (keyCode === 'KeyV') {
        // v - paste:
        this.snackBar.open('Pasting is not working right now.', 'OK', { duration: 1000 });
        return;
      }
    } else {
      // ctrl only combinations
      if (keyCode === 'KeyA') {
        // a - move to start of line
        this.caretPosition = 0;
        this.updateCommand();
        return;
      }
      if (keyCode === 'KeyB') {
        // b - move one character back
        this.moveCaret('ArrowLeft');
        return;
      }
      if (keyCode === 'KeyC') {
        // c - terminate
        this.commandMiddle = '^';
        this.commandEnd = 'C' + this.commandEnd.slice(1);
        this.addCommandToOutput();
        return;
      }
      if (keyCode === 'KeyD') {
        // d - exit if empty or delete char
        if (this.command.length === 0) {
          this.clearCommand();
          this.commandStart = 'exit'
          this.addCommandToOutput();
          window.location.reload();
        }
        this.commandMiddle = '';
        this.updateCommand();
        return;
      }
      if (keyCode === 'KeyE') {
        // e - move to end of line
        this.caretPosition = this.command.length;
        this.updateCommand();
        return;
      }
      if (keyCode === 'KeyF') {
        // f - move one character forward
        this.moveCaret('ArrowRight');
        return;
      }
      if (keyCode === 'KeyG') {
        // g - terminate reverse search
        this.search = false;
        return;
      }
      if (keyCode === 'KeyH') {
        // h - backspace
        this.commandStart = this.commandStart.slice(0, -1);
        this.caretPosition = this.commandStart.length;
        return;
      }
      if (keyCode === 'KeyJ') {
        // j - enter
        this.onEnter();
        return;
      }
      if (keyCode === 'KeyK') {
        // k - delete all after caret
        this.commandCut = this.commandMiddle + this.commandEnd;
        this.commandMiddle = '';
        this.commandEnd = '';
        this.caretPosition = this.command.length;
        this.updateCommand();
        return;
      }
      if (keyCode === 'KeyL') {
        // l - clear and display current line
        InitService.outputService.clearOutput();
        return;
      }
      if (keyCode === 'KeyM') {
        // m - enter
        this.onEnter();
        return;
      }
      if (keyCode === 'KeyN') {
        // n - displays next line in history
        this.moveHistory('ArrowDown');
        return;
      }
      if (keyCode === 'KeyP') {
        // p - displays previous line in history
        this.moveHistory('ArrowUp');
        return;
      }
      if (keyCode === 'KeyR') {
        // r - search history backwards
        this.history.cacheCommand(this.command);
        this.commandStart = '';
        this.search = true;
        return;
      }
      if (keyCode === 'KeyS') {
        // s - search history forwards
        return;
      }
      if (keyCode === 'KeyT') {
        // t - swaps last two characters
        // WARNING: This does not work since Ctrl + T opens new tab 
        return;
      }
      if (keyCode === 'KeyU') {
        // u - delete all in front of caret
        this.commandCut = this.commandStart;
        this.commandStart = '';
        this.caretPosition = 0;
        this.updateCommand();
        return;
      }
      if (keyCode === 'KeyW') {
        // w - delete word in front of caret
        // WARNING: This does not work since Ctrl + W closes the tab 
        return;
      }
      // y and z depending on keyboard => keys and not keyCodes
      if (key === 'y' || key === 'Y') {
        // y - paste previously cut text
        this.commandStart += this.commandCut;
        return;
      }
      if (key === 'z' || key === 'Z') {
        // z - kills command which can be resumed with fg or bg
        return;
      }
    }
    return;
  }

  @HostListener('document:keydown', ['$event'])
  listenKeyDown(e: KeyboardEvent) {
    if (this.ctrl) {
      if (e.key === 'Shift') {
        // Shift key is pressed after Ctrl
        this.shift = true;
        return;
      }
      // check for key combination
      e.preventDefault();
      this.checkKeyCombinations(e.code, e.key);
      return;
    }
    if (this.validInputs.includes(e.key)){
      // add to command
      this.commandStart += e.key;
      this.caretPosition = this.commandStart.length;
      e.preventDefault();
      return;
    }
    if (e.key === 'Backspace'){
      // remove last from start
      this.commandStart = this.commandStart.slice(0, -1);
      this.caretPosition = this.commandStart.length;
      e.preventDefault();
      return;
    }
    if (this.search) {
      this.commandStart = this.searchResult;
    }
    this.search = false;
    if (this.horizontalMovement.includes(e.key)) {
      // move caret/cursor
      this.moveCaret(e.key);
      e.preventDefault();
      return;
    }
    if (this.verticalMovement.includes(e.key)) {
      // move in command history
      this.moveHistory(e.key);
      e.preventDefault();
      return;
    }
    if (e.key === 'Delete'){
      // remove on caretPosition and update
      this.commandMiddle = '';
      this.updateCommand();
      return;
    }
    if (e.key === 'Control') {
      // Ctrl key is pressed
      this.ctrl = true;
      return;
    }
    if (e.key === 'Shift') {
      // Shift key is pressed
      this.shift = true;
      return;
    }
    if (e.key === 'Alt') {
      // Alt key is pressed
      this.snackBar.open('Alt combinations are not available', 'OK', { duration: 1000 });
      return;
    }
    if (e.key === 'Tab') {
      // display autocomplete
      let autocompletes = this.autocompleteService.getAutocomplete(this.commandStart);
      if (autocompletes.length === 1) {
        this.commandStart = this.commandStart.replace(/([^\s]+)$/, autocompletes[0]);
      }
      if (autocompletes.length > 1) {
        this.addCommandToOutput(false);
        InitService.outputService.println(autocompletes.join(' '));
      }
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter') {
      // execute command
      this.onEnter();
      return;
    }
    this.snackBar.open(e.key + ' is not yet supported', 'OK', { duration: 1000 });
  }

  @HostListener('document:keyup', ['$event'])
  listenKeyUp(e: KeyboardEvent) {
    if (e.key === 'Control') {
      // Ctrl key is not pressed anymore
      this.ctrl = false;
      return;
    }
    if (e.key === 'Shift') {
      // Shift key is not pressed anymore
      this.shift = false;
      return;
    }
  }
}
