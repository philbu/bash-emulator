import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { InitService } from './services/init.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  ip = this.getIP();
  date = this.getDate();

  motd = `<pre>Welcome to the bash emulator and curriculum vitae of
 _____  _     _ _
|  __ \\| |   (_) |
| |__) | |__  _| |
|  ___/| '_ \\| | |
| |    | | | | | |
|_|    |_| |_|_|_|
 ____                 _
|  _ \\               | |
| |_) |_   _ ___  ___| |__  _ __ ___   __ _ _ __  _ __
|  _ <| | | / __|/ __| '_ \\| '_ \` _ \\ / _\` | '_ \\| '_ \\
| |_) | |_| \\__ \\ (__| | | | | | | | | (_| | | | | | | |
|____/ \\__,_|___/\\___|_| |_|_| |_| |_|\\__,_|_| |_|_| |_|

</pre>
<table>
  <tbody>
    <tr>
      <td>
        &nbsp;* Documentation:&nbsp;&nbsp;&nbsp;
      </td>
      <td>
        <a href="http://cc.iiti.ac.in/docs/linuxcommands.pdf">http://cc.iiti.ac.in/docs/linuxcommands.pdf</a>
      </td>
    </tr>
    <tr>
      <td>
        &nbsp;* More infos:
      </td>
      <td>
        <a href="https://github.com/philbu/bash-emulator">https://github.com/philbu/bash-emulator</a>
      </td>
    </tr>
    <tr>
      <td>
        &nbsp;* Contact:
      </td>
      <td>
        <a href="mailto:phil.buschmann@tum.de">phil.buschmann@tum.de</a>
      </td>
    </tr>
  </tbody>
</table>
<pre>

Last login: ${this.date} from ${this.ip}

Type \`help\` for help.
</pre>`

  constructor() { }

  get user() {
    return InitService.userService.user.getName();
  }

  get directory() {
    return InitService.filesystemService.directory;
  }

  get output() {
    return InitService.outputService.getOutput();
  }
  
  getIP(){
    return (Math.floor(Math.random() * 255) + 1)+'.'+(Math.floor(Math.random() * 255) + 0)+'.'+(Math.floor(Math.random() * 255) + 0)+'.'+(Math.floor(Math.random() * 255) + 0);
  }

  getDate(){
    return moment().format('ddd MMM D HH:mm:ss YYYY');
  }

  ngOnInit(): void {
    InitService.outputService.addOutput(this.motd);
  }
}
