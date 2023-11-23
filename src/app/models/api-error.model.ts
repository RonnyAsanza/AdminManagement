export class ApiErrorViewModel {
    source?: string;
    instance?: string;
    code: number = 0;
    message: string = '';
    values: { [key: string]: string } = {};
    detail?: string;
    errors: { [key: string]: string[] } = {};
  }
  