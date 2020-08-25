import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  ip: string = '';
  date: string = '';

  get user() {
    return 'user';
  }

  get directory() {
    return '~';
  }
  
  getIP(){
    return (Math.floor(Math.random() * 255) + 1)+'.'+(Math.floor(Math.random() * 255) + 0)+'.'+(Math.floor(Math.random() * 255) + 0)+'.'+(Math.floor(Math.random() * 255) + 0);
  }

  getDate(){
    return moment().format('ddd MMM D HH:mm:ss YYYY');
  }

  ngOnInit(): void {
    this.ip = this.getIP();
    this.date = this.getDate();
  }
}
