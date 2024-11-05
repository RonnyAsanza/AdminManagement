import { TaxAndFeeValueTypeEnum } from './tax-and-fee.model';
export interface ApplicationTariffTaxAndFee {
    applicationTariffTaxAndFeeKey: number;
    applicationTariffTaxAndFeeGuid: string;
    tariffTaxAndFeeKey: number;
    baseValue: number;
    appliedValue: number;
    calculatedValue: number;
    taxAndFeeValueType: TaxAndFeeValueTypeEnum;
    applicationKey: number;
}