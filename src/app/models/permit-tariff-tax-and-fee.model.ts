import { TaxAndFeeValueTypeEnum } from './tax-and-fee.model';
import { TariffTaxAndFeeViewModel } from './tariff-tax-and-fee.model';
export class PermitTariffTaxAndFee {
    permitTariffTaxAndFeeKey?: number;
    permitTariffTaxAndFeeGuid?: string;
    tariffTaxAndFeeKey?: number;
    baseValue?: number;
    appliedValue?: number;
    calculatedValue?: number;
    taxAndFeeValueType?: TaxAndFeeValueTypeEnum;
    permitKey?: number;
}

export interface PermitTariffTaxAndFeeViewModel {
    permitTariffTaxAndFeeKey: number;
    permitTariffTaxAndFeeGuid: string;
    tariffTaxAndFeeKey: number;
    baseValue: number;
    appliedValue: number;
    calculatedValue: number;
    taxAndFeeValueType: TaxAndFeeValueTypeEnum;
    permitKey: number;
    tariffTaxAndFee?: TariffTaxAndFeeViewModel;
}