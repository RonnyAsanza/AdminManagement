import { TariffViewModel } from './tariff.models';
import { TaxAndFee } from './tax-and-fee.model';

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
    tariff?: TariffViewModel;
    taxAndFeeKey: number;
    taxAndFee?: TaxAndFee;
}