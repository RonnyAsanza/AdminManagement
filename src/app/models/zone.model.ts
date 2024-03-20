export interface ZoneViewModel {
    zoneKey?: number;
    zoneGuid?: string,
    name?: string;
    description?: string;
    enabled?: boolean;
    zoneTypeKey?: number;
    zoneTypeName?: string;
    companyKey?: number;
    companyName?: string;
    zoneLookupTypeKey?: number;
    zoneLookupType?: string;
    requireAccessControl?: boolean;
    latitude?: number;
    longitude?: number;
  }

export enum ZoneLookupTypeEnum {
    zoneSelection = 1,
    zoneSelectionNoAddress = 2,
    geofencing = 3
}
