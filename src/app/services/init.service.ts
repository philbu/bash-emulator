import { Injectable } from '@angular/core';
import { OutputService } from './output.service';
import { UserService } from './user/user.service';
import { FilesystemService } from './files/filesystem.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  static filesystemService: FilesystemService;
  static userService: UserService;
  static outputService: OutputService;

  private static _initialize = (() => {
    // "this" cannot be used here
    InitService.userService = new UserService();
    InitService.outputService = new OutputService();
    InitService.filesystemService = new FilesystemService(InitService.userService);
  })();

  constructor() { }
}

