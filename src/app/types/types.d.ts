import { File } from '../services/files/file';

export type ValidationResponse = {
  valid: boolean;
  desc?: string;
}

export type FunctionResponse = {
  code: number;
  output: string | File;
}