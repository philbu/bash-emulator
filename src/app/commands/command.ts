export interface Command{
  name: string;
  shortFlags: string[]; // UNIX-Style
  longFlags: string[];  // GNU-Style
  other: string[];
}
