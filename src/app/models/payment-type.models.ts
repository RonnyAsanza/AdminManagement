export class PaymentType {
    paymentTypeKey: number;
    name: string;
    description: string;
    
    constructor(pPermitTypeKey: number, pName: string, pDescription: string) {
      this.paymentTypeKey = pPermitTypeKey;
      this.name = pName;
      this.description = pDescription;
    }
  }
  