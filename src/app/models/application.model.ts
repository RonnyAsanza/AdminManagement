import { SafeUrl } from "@angular/platform-browser";
import { PermitTariffTaxAndFeeViewModel } from './permit-tariff-tax-and-fee.model';

export class Application {
    applicationKey?: number;
    applicationGuid?: string;
    zoneKey?: number;
    zone? : string;
    permitTypeKey?: number;
    permitType? : string;
    price?: number;
    tariffKey?: number;
    tariff? : string;
    licensePlate? : string;
    costToClient?: number;
    startDateUtc? : Date;
    expirationDateUtc? : Date;
    applicationStatusKey?: number;
    applicationStatus?: string;
    applicationStatusCode?: string;
    additionalInput1?: string;
    additionalInput2?: string;
    sostToClient? : number;
    documents?: DocumentViewModel[];
    requestNumber?: number;
    total?: number;
    taxesAndFees?: PermitTariffTaxAndFeeViewModel[];
    quantity?: number;
  }

  export interface DocumentViewModel {
    applicationRequiredDocumentationKey: string;
    applicationKey: number;
    companyKey: number;
    documentType: string;
    description: string;
    contentType?: string;
    dateCreatedUtc: string;
    fileData?: string;
    imageUrl: SafeUrl | undefined;
    documentFile?: File
  }
  