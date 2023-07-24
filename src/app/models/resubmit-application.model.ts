
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
  licenseDriver?: File;
  proofReisdence?: File;
}
