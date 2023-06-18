import { PermitType } from "./permit-type.models";

export class ApplyPermit {
  companyKey?: number;
  zoneName?: string;
  zoneKey?: number;
  permitType?: PermitType;
  name?: string;
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
}
