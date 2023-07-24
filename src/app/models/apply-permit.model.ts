import { PermitTypeViewModel } from "./permit-type.model";

export class ApplyPermit {
  companyKey?: number;
  zoneName?: string;
  zoneKey?: number;
  permitTypeKey?: number;
  name?: string;
  permitTypeModel?: PermitTypeViewModel;
  zoneTypeKey?: number;
  zoneType?: string;
  tariffKey?: number;
  startDateUtc?: Date;
  expirationDateUtc?: string;
  licensePlate?: string;
  quantity?: number;
  price?: number;
  total?: number;
  additionalInput1?: string;
  additionalInput2?: string;
  additionalInput3?: string;
  additionalInput4?: string;
  additionalInput5?: string;
  licenseDriver?: File;
  proofReisdence?: File;
}
