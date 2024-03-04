import { TaxAndFeeValueTypeEnum, TaxAndFeeTypeEnum } from './tax-and-fee.model';

export interface TariffTaxAndFee {
    tariffTaxAndFeeKey: number;
    tariffTaxAndFeeGuid: string;
    startDate: Date | null;
    endDate: Date | null;
    value: number;
    enabled: boolean;
    tariffKey: number;
    taxAndFeeKey: number;
}

export interface TariffTaxAndFeeViewModel {
    tariffTaxAndFeeKey: number;
    tariffTaxAndFeeGuid: string;
    startDate: Date | null;
    endDate: Date | null;
    value: number;
    enabled: boolean;
    tariffKey: number;
    tariffName?: string;
    taxAndFeeName?: string;
    taxAndFeeKey: number;
    taxAndFeeValueType: TaxAndFeeValueTypeEnum;
    taxAndFeeType: TaxAndFeeTypeEnum;
}