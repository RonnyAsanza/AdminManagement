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
    documents?: Document[];
    requestNumber?: number;
  }

  export interface Document {
    applicationKey: number;
    applicationRequiredDocumentationKey: string;
    companyKey: number;
    contentType: string;
    dateCreatedUtc: string;
    documentType: string;
    fileData: string;
  }
  