export interface TaxAndFee {
        taxAndFeeKey: number;
        TaxAndFeeGuid: string;
        name: string;
        description: string;
        taxAndFeeType: TaxAndFeeTypeEnum;
        taxAndFeeValueType: TaxAndFeeValueTypeEnum;
        enabled: boolean;
        companyKey: number | null;
}

export enum TaxAndFeeTypeEnum {
    Tax = 0,
    Fee = 1
}

export enum TaxAndFeeValueTypeEnum
{
    Fixed = 0,
    Percentage = 1
}