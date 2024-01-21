import { ReceiptViewModel } from "./receipt.model";

export class Permit {
    permitKey?: number;
    permitGuid?: string;
    applicationGuid?: string;
    zoneKey?: number;
    zone? : string;
    permitTypeKey?: number;
    permitType? : string;
    tariffKey?: number;
    tariff? : string;
    licensePlate? : string;
    startDateUtc? : Date;
    expirationDateUtc? : Date;
    permitStatusKey?: number;
    permitStatusCode?: string;
    permitStatus? : string;
    companyKey?: number;
    price?: number;
    quantity?: number;
    description?: string;
    monerisReceipt?: ReceiptViewModel;
    requestNumber?: number;
  }