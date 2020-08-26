import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userList: User[] = [];
  currentUser: User;
  root: User;

  counter: number = 1000;

  usernames = ['curious-user', 'sql-injector', 'attacker-x', 'confused-hr', 'your-advertising', 'sudo', 'SEGFAULT']

  constructor() {
    // initialize user list with root and user
    this.root = new User('root', 0).setHomeDir('/root');
    this.userList.push(this.root);
    // automatically sets group and home
    this.currentUser = new User(this.selectRandomUserName(), this.uid);
    this.userList.push(this.currentUser);
  }

  selectRandomUserName() {
    return this.usernames[Math.floor(Math.random()*this.usernames.length)];
  }

  get user(): User {
    return this.currentUser;
  }

  get uid() {
    return this.counter++;
  }

  getRoot(): User {
    return this.root;
  }
}
