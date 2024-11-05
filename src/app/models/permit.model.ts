import { ReceiptViewModel } from "./receipt.model";
import { PermitTariffTaxAndFeeViewModel } from './permit-tariff-tax-and-fee.model';

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
    unitPrice?: number;
    quantity?: number;
    description?: string;
    monerisReceipt?: ReceiptViewModel;
    requestNumber?: number;
    total?: number;
    taxesAndFees?: PermitTariffTaxAndFeeViewModel[];
    typeEnum?: number;
    typeEnumValue?: string;
    totalUnits?: number;
    availableUnits?: number;
    validUntilUtc?: Date;
    permitsBankedSession?: PermitBankedSessionViewModel[];
  }
  
  export class PermitBankedSessionViewModel {
    permitKey?: number;
    permitGuid?: string;
    licensePlate? : string;
    startDateUtc? : Date;
    expirationDateUtc? : Date;
    permitStatusCode?: string;
    permitStatus? : string;
    requestNumber?: number;
    typeEnum?: number;
    typeEnumValue?: string;
    validUntilUtc?: Date;
  }
  

