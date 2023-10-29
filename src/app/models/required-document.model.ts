export interface RequiredDocumentViewModel {
    requiredDocumentKey?: number;
    documentTypeKey?: number,
    documentType?: string;
    documentKey?: number;
    documentName?: string;
    documentDescription?: string;
    documentFile?: File
  }

  export interface PermitObjectsViewModel {
    companyKey?: number;
    permitTypeKey?: number,
    tariffKey?: string;
    zoneKey?: number;
  }