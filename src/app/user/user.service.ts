import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  static userList: User[] = [];
  static currentUser: User;
  static root: User;

  static counter: number = 1000;

  constructor() { }

  private static _initialize = (() => {
    // "this" cannot be used here
    UserService.root = new User('root', 0).setHomeDir('/root');
    UserService.userList.push(UserService.root);
    UserService.currentUser = new User('phil', UserService.counter++);
    UserService.userList.push(UserService.currentUser);
  })();

  static getUser(): User {
    return this.currentUser;
  }

  static getRoot(): User {
    return this.root;
  }
}
