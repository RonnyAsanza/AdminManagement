import { SafeUrl } from "@angular/platform-browser";

export interface PermitCategoryViewModel {
    permitCategoryKey?: number;
    name?: string;
    companyKey?: number;
    description?: number;
    companyName?: string;
    zoneLookupTypeKey?: number;
    zoneLookupTypeName?: string;
    image?: string;
    imageUrl?: SafeUrl | undefined;
    imageFile?: File;
    enabled?: boolean;
  }