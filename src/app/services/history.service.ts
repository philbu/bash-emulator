import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  history: string[] = [];

  historyPosition: number = 0;

  cachedCommand = '';

  constructor() { }

  addCommand(command: string) {
    this.history.push(command);
    this.historyPosition = this.history.length;
  }

  decreasePosition(command: string = '') {
    // if new command which is not yet in history
    if (this.historyPosition === this.history.length) {
      // cache command before changing command
      this.cachedCommand = command;
    }
    this.historyPosition = Math.max(0, this.historyPosition-1);
    return this.getCommand();
  }

  increasePosition() {
    this.historyPosition = Math.min(this.historyPosition+1, this.history.length);
    return this.getCommand();
  }

  getCommand() {
    return this.history[this.historyPosition] || this.cachedCommand;
  }

  cacheCommand(command: string) {
    this.cachedCommand = command;
  }

  searchCommand(searchTerm: string) {
    if (searchTerm === '') {
      return this.cachedCommand;
    }
    let index = this.history.findIndex(x => x.includes(searchTerm));
    this.historyPosition = index === -1 ? this.historyPosition : index;
    return this.history[this.historyPosition];
  }
}
