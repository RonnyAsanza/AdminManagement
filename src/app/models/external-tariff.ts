export class RateEngineByEndDateBasedRequest {
  TariffID: number = 1;
  StartTime: string = '';
  EndTime: string = '';
  Quantity: number = 1;
  TCP_Calculate_Add: boolean = false;
}

export class RateEngineByEndDateBasedRResponse {
    totalCharge: string = '';
    totalDuration?: string;
    endTime?: Date;
    endTimeUTC?: Date;
}

export class GetCompanyTariff {
  companyId: number = 0;
  startDate: Date = new Date();
}
  
export class EngineSiteTariffViewModel
{
  tariffID: number = 0;
  tariffName: string = '';
  siteID: number = 0;
  sitePeriod: SitePeriod | undefined;
}

export class SitePeriod
{
    tariffPeriodId: number = 0;
    startDate: Date = new Date();
    endtDate: Date = new Date();
    tariffType: string = '';
    minimum: number = 0;
    dailyMax: number = 0;
    weeklyMax: number = 0;
    overallMax: number = 0;
    siteDefDtl: SiteDefDtl | undefined;
}

export class SiteDefDtl
{
  weekDay: string = '';
  startTime: string = '';
  endTime: string = '';
  rateID: number = 0;
  rateName: string = '';
  fixedRate: number = 0;
  linkToNextZone: string = '';
  unit: string = '';
  siteRateStep: SiteRateStep | undefined;
}

export class SiteRateStep
{
  step: number = 0;
  rate: number = 0;
  duration: number = 0;
}