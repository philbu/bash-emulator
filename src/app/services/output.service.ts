import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OutputService {

  output: string = '';

  constructor() { }

  addOutput(newOutput: string) {
    this.output += newOutput;
  }

  println(output:string){
    this.output += output + '<br />';
  }

  print(output:string){
    this.output += output;
  }

  getOutput() {
    return this.output;
  }

  clearOutput() {
    this.output = '';
  }
}
