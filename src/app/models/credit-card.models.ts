export class CreditCard {
    creditCardKey: number;
    name: string;
    type: string;
    maskedNumber: string;
    expiration: string;
  
    constructor(pCreditCardKey: number, pName: string, pType:string,  pMaskedNumber: string, pExpiration: string) {
      this.creditCardKey = pCreditCardKey;
      this.name = pName;
      this.type = pType;
      this.maskedNumber = pMaskedNumber
      this.expiration = pExpiration;
    }
  }
  