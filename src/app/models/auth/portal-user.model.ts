export interface PortalUserViewModel {
    portalUserKey?: number;
    userName?: string;
    companyGuid?: string;
    emailAddress?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    smsPhoneNumber?: string;
    smsNotificationsEnabled?: boolean;
    emailNotificationsEnabled?: boolean;
    companyKey?: number;
    confirmationUrl?: string;
    languageKey?: number;
    languageName?: string;
    portalUserStatusKey?: number;
    portalUserStatusName?: string;
    token?: string;
    refreshToken?: string;
    expiration?: Date;
}

export interface TokenViewModel {   
    accessToken?: string;
    refreshToken?: string;
}