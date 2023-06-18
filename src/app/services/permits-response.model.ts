export class PermitsResponse<T>{
    succeeded?: boolean;
    message?: string;
    data?: T;
    constructor() {
    }
}
  