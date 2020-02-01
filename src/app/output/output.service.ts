import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OutputService {

  static output: string = '';

  constructor() { }

  static print(output:string){
    this.output += output;
  }

  static println(output:string){
    this.output += output + '\n';
  }

  static getOutput(): string{
    return this.output;
  }
}