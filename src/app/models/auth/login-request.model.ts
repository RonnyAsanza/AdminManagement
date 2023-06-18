export class LoginRequest {
    userName: string;
    password: string;
    externalCompanyId: string;
  
    constructor(pUserName: string, pPassword: string, externalCompanyId: string) {
      this.userName = pUserName;
      this.password = pPassword;
      this.externalCompanyId = externalCompanyId;
    }
  
  }  