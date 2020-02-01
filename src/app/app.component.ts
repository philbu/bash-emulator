import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';
import * as moment from 'moment';

import { WhoamiService } from './services/whoami.service';
import { WService } from './services/w.service';
import { UptimeService } from './services/uptime.service';
import { UnameService } from './services/uname.service';
import { EchoService } from './services/echo.service';

import { FilesystemService } from './files/filesystem.service';
import { UserService } from './user/user.service';
import { CommandService } from './commands/command.service';
import { HandlerService } from './commands/handler.service';
import { OutputService } from './output/output.service';


import { IpService } from './connection/ip.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: string = UserService.getUser().getName();
  domain: string = 'phil-buschmann.de';
  folder: string = FilesystemService.getCurrentDirectory();

  commands: string[] = [];
  counter: number = 0;

  ip: string = '';
  date: string = '';

  ctrl: boolean = false;
  shift: boolean = false;

  copy: string = '';

  command_start: string = '';
  command_middle: string = '';
  command_end: string = '';
  output: string = '';

  cache_command: string = '';

  array: string[] = ['whoami', 'w', 'echo', 'clear', 'ls', 'cat', 'mkdir', 'uptime', 'uname', 'touch'];

  constructor(public handlerService: HandlerService) {
    /*window.onbeforeunload = function(e) {
      return 'Ctrl + W closes the Tab instead of deleting a word. This cannot be prevented.';
    };*/
  }

  getOutput(){
    return OutputService.getOutput();
  }

  ngOnInit() {
    this.ip = IpService.getIP();
    this.date = this.getDate();
  }

  @HostListener('document:keyup', ['$event'])
  keyUp(e: KeyboardEvent){
    if(e.which == 16){
      this.shift = false;
      e.preventDefault();
    }
    if(e.which == 17){
      this.ctrl = false;
      e.preventDefault();
    }
  }

  @HostListener('document:keydown', ['$event'])
  keyDown(e: KeyboardEvent){
    if (e.which == 9){
      this.autocomplete();
      e.preventDefault();
      return;
    }
    else if (e.code === 'ArrowLeft'){
      this.moveCursor(-1);
      // arrow
      e.preventDefault();
      return;
    }
    else if (e.code === 'ArrowRight'){
      this.moveCursor(1);
      // arrow
      e.preventDefault();
      return;
    }
    else if (e.code === 'ArrowUp'){
      this.changeCounter(-1);
      // arrow
      e.preventDefault();
      return;
    }
    else if (e.code === 'ArrowDown'){
      this.changeCounter(1);
      // arrow
      e.preventDefault();
      return;
    }
    else if (e.key === 'Backspace') {
      window.scrollTo(0,document.body.scrollHeight);
      this.command_start = this.command_start.slice(0, -1);
      return;
    }
    else if (e.key === 'Alt') {
      return;
    }
    else if (e.which == 16){
      this.shift = true;
      return;
    }
    else if (e.which == 17){
      this.ctrl = true;
      return;
    }
    else if (e.which == 16){
      e.preventDefault();
      return;
    }
    else if ((e.which == 55) || (e.which == 163)){
      window.scrollTo(0,document.body.scrollHeight);
      this.command_start += e.key;
      e.preventDefault();
      return;
    }
    else if (e.which === 13) {
      window.scrollTo(0,document.body.scrollHeight);
      let command = this.getCommand();
      command = command.replace(/^\s+/g, '');
      command = command.replace(/\s+$/g, '');
      this.execute(command);
      this.overwriteCommand('');
      return;
    }
    if (this.ctrl && !this.shift){
      this.ctrl_execute(e);
      return;
    }
    if (this.ctrl && this.shift){
      if (e.which === 67){
        // ctrl shift c = copy
        this.copy = this.getSelection();
        document.execCommand('copy');
        e.preventDefault();
      }
      if (e.which === 86){
        // ctrl shift v = insert
        this.command_start += this.copy;
        e.preventDefault();
      }
      return;
    }
    window.scrollTo(0,document.body.scrollHeight);
    this.command_start += e.key;
  }

  autocomplete(){
    const autocomplete_array = this.array.filter(word => word.startsWith(this.getCommand()));
    if (autocomplete_array.length === 0){
      return;
    }
    if (autocomplete_array.length === 1){
      this.command_start = autocomplete_array[0];
      return;
    }
    this.saveCommandHistory();
    this.saveOutput(autocomplete_array.join(' '));
  }

  saveCommandHistory(){
    OutputService.print(
      `<pre><b><span class="user">${UserService.getUser().getName()}@${this.domain}</span>:<span class="folder">${this.folder}</span></b>$</pre>&nbsp;<pre>${this.getCommand()}</pre><br>`
    );
  }

  saveOutput(output){
    OutputService.print(output+'<br>');
  }

  execute(command: string){
    if (command == ''){
      this.saveCommandHistory();
      return;
    }
    this.commands.push(command);
    this.counter = this.commands.length;
    this.saveCommandHistory();
    this.handlerService.execute(command);
    /*const command_name = command.split(' ')[0];
    switch(command_name){
      case 'whoami':
        this.output += WhoamiService.command(command, UserService.getUser().getName());
        break;
      case 'w':
        this.output += WService.command(command, UserService.getUser().getName(), this.ip);
        break;
      case 'uptime':
        this.output += UptimeService.command(command);
        break;
      case 'uname':
        this.output += UnameService.command(command);
        break;
      case 'echo':
        this.output += EchoService.command(command);
        break;
      case 'clear':
        this.output = '';
        return;
      default:
        this.output += this.getError(command_name);
        break;
    }
    this.output += '\n';*/
    // TODO
  }

  ctrl_execute(e:KeyboardEvent){
    e.preventDefault();
    if (e.which === 67){
      // Ctrl + C
      this.command_start += '^C';
      this.saveCommandHistory();
      this.overwriteCommand('');
      return;
    }
    if (e.which === 90){
      // Ctrl + z
      e.preventDefault();
    }
    if (e.which === 68){
      // Ctrl + d
      e.preventDefault();
    }
    if (e.which === 87){
      // Ctrl + w
      const lastIndex = this.command_start.lastIndexOf(' ');
      this.command_start = this.command_start.substring(0, lastIndex);
      e.preventDefault();
    }
    if (e.which === 85){
      // Ctrl + u
      e.preventDefault();
    }
    if (e.which === 82){
      // Ctrl + r
      e.preventDefault();
    }
  }

  getSelection(){
    let text = '';
    if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
  }

  changeCounter(number){
    window.scrollTo(0,document.body.scrollHeight);
    if (this.counter == this.commands.length){
      this.cache_command = this.getCommand();
    }
    if ((this.counter + number) > this.commands.length - 1){
      this.counter = this.commands.length;
      this.overwriteCommand(this.cache_command);
      return;
    } else if ((this.counter + number) < 0) {
      return;
    }
    this.counter = this.counter + number;
    this.overwriteCommand(this.commands[this.counter]);
  }

  moveCursor(number: number){
    window.scrollTo(0,document.body.scrollHeight);
    if ((this.command_start.length + number) < 0){
      // do nothing
      return;
    }
    if ((this.command_end.length - number) < 0){
      this.command_start += this.command_middle;
      this.command_middle = '';
      return;
    }
    if (number < 0){
      if (this.command_middle.length > 0){
        this.command_end = this.command_middle + this.command_end;
      }
      this.command_middle = this.command_start.slice(number);
      this.command_start = this.command_start.slice(0, number);
      return;
    } else {
      if (this.command_middle.length > 0){
        this.command_start += this.command_middle;
      }
      this.command_middle = this.command_end[0];
      this.command_end = this.command_end.slice(number,this.command_end.length)
    }
    //console.log(this.command_start.slice(number),this.command_end.slice(-number));
  }

  getError(command){
    return `bash: `+command+`: command not found`;
  }

  getCommand(){
    return this.command_start + this.command_middle + this.command_end;
  }

  overwriteCommand(command){
    this.command_start = command;
    this.command_middle = '';
    this.command_end = '';
  }

  getIP(){
    return (Math.floor(Math.random() * 255) + 1)+'.'+(Math.floor(Math.random() * 255) + 0)+'.'+(Math.floor(Math.random() * 255) + 0)+'.'+(Math.floor(Math.random() * 255) + 0);
  }

  getDate(){
    return moment().format('ddd MMM D HH:mm:ss YYYY');
  }
}
