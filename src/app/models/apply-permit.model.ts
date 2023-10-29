import { PermitTypeViewModel } from "./permit-type.model";
import { RequiredDocumentViewModel } from "./required-document.model";

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
  startDateUtc?: string;
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
  requiredDocuments?: RequiredDocumentViewModel[]

  //licenseDriver?: File;
  //proofReisdence?: File;
}
