export class PermitsResponse<T>{
    succeeded?: boolean;
    message?: string;
    data?: T;

    constructor(succeeded?: boolean, message?: string, data?: T) {
        this.succeeded = succeeded;
        this.message = message;
        this.data = data;
    }
}
  