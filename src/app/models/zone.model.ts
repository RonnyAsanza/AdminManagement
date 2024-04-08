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
    address?: string;
    coordinates?: string;
    latitude?: number, 
    longitude?: number
  }

  export enum ZoneLookUpTypeEnum {
    ZONE_SELECTION = 1,
    ZONE_SELECTION_NO_ADDRESS = 2,
    ZONE_SELECTION_GEOFENCING = 3,
}