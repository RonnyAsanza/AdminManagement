export class RateEngineByEndDateBasedRequest {
  TariffID: number = 1;
  StartTime: string = '';
  EndTime: string = '';
  TCP_Calculate_Add: boolean = false;
}

export class RateEngineByEndDateBasedRResponse {
    totalCharge: string = '';
    totalDuration?: string;
    endTime?: Date;
    endTimeUTC?: Date;
}
  