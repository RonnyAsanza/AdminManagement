export class Tariff {
  tariffId: number;
  name: string;

  constructor(pTariffId: number, pName: string) {
    this.tariffId = pTariffId;
    this.name = pName;
  }
}

export class TariffViewModel {
  tariffId: number = 0;
  tariffGuid: string = '';
  companyKey: number | null = null;
  enabled: boolean = false;
  name: string = '';
  shortName: string | null = null;
  description: string | null = null;
  startDay: number = 0;
  startMonth: number = 0;
  startDayOfTheWeekEnum: DayOfTheWeek = DayOfTheWeek.Sunday;
  availableDate: Date = new Date();
  costToClient: number = 0;
  gracePeriod: string = ''; // Assuming you have a specific format for TimeSpan
  allowChooseStartDate: boolean = false;
  allowChooseEndDate: boolean = false;
  displayDateOnly: boolean = false;
  externalTariffId: number = 0;
}
  
export enum DayOfTheWeek {
  Sunday = 1,
  Monday = 2,
  Tuesday = 3,
  Wednesday = 4,
  Thursday = 5,
  Friday = 6,
  Saturday = 7
}