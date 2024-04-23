export interface PermitTypeViewModel {
    permitTypeKey?: number;
    permitTypeGuid?: string;
    enabled?: boolean;
    companyKey?: number;
    companyName?: string;
    zoneLookupTypeKey?: number;
    zoneLookupTypeName?: string;
    name?: string;
    allowCodeUpdates?: boolean;
    maxCodeChangesInTimeInterval?: number;
    codeChangeTimeIntervalKey?: number;
    timeIntervalName?: string;
    allowComments?: boolean;
    allowSharing?: boolean;
    allowCancellation?: boolean;
    requireApproval?: boolean;
    requireAdditionalInput1?: boolean;
    requireAdditionalInput2?: boolean;
    requireAdditionalInput3?: boolean;
    requireAdditionalInput4?: boolean;
    requireAdditionalInput5?: boolean;
    permitTypeEnum?: number;
    permitTypeEnumValue?: string;
    minAllowed?: number;
    maxCount?: number;
  }
  
  export enum TypeEnum {
    Standard = 0,
    Container = 1,
    BankedSession = 2
  }

  export enum PermitTypesEnum {
      Standard = 0,
      Bulk = 1,
      Banked = 2
  }