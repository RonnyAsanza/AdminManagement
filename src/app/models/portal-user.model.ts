export class PortalUser {
    userName?: string;
    emailAddress?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    smsPhoneNumber?: string;
    SmsNotificationsEnabled: boolean = false;;
    EmailNotificationsEnabled: boolean = false;
    companyKey?: number;
    confirmationURL?: string;
  }
