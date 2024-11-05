import { DocumentViewModel } from "./application.model";

export class ReSubmitApplication {
  applicationKey?: number;
  zoneKey?: number;
  zoneTypeKey?: number;
  zoneType?: string;
  tariffKey?: number;
  startDateUtc?: Date;
  expirationDateUtc? : Date;
  licensePlate?: string;
  quantity?: number;
  price?: number;
  total?: number;
  additionalInput1?: string;
  additionalInput2?: string;
  additionalInput3?: string;
  additionalInput4?: string;
  additionalInput5?: string;
  documents?: DocumentViewModel[];
}
