import { PermitCategoryViewModel } from "./permit-category.model";
import { PermitTypeViewModel } from "./permit-type.model";
import { RequiredDocumentViewModel } from "./required-document.model";
import { TariffViewModel } from "./tariff.models";
import { PermitTariffTaxAndFee } from './permit-tariff-tax-and-fee.model';

export class ApplyPermit {
  companyKey?: number;
  zoneName?: string;
  zoneKey?: number;
  permitTypeKey?: number;
  name?: string;
  permitTypeModel?: PermitTypeViewModel;
  tariffModel?: TariffViewModel;
  permitCategory?: PermitCategoryViewModel;
  zoneTypeKey?: number;
  zoneType?: string;
  tariffKey?: number;
  startDateUtc?: string;
  expirationDateUtc?: string;
  licensePlate?: string;
  quantity?: number;
  price?: number;
  total?: number;
  subTotal?: number;
  additionalInput1?: string;
  additionalInput2?: string;
  additionalInput3?: string;
  additionalInput4?: string;
  additionalInput5?: string;
  requiredDocuments?: RequiredDocumentViewModel[];
  taxesAndFees?: PermitTariffTaxAndFee[];
}