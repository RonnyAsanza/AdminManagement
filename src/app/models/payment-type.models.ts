export class PaymentType {
    paymentTypeKey: number;
    name: string;
  
    constructor(pPermitTypeKey: number, pName: string) {
      this.paymentTypeKey = pPermitTypeKey;
      this.name = pName;
    }
  }
  