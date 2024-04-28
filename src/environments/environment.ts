// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    //PROD
    //apiPermitsURL: 'https://permit-service.preciseparklink.com/PermitApi/api/v1/',
    //apiTranslationServiceURL: 'https://permit-service.preciseparklink.com/TranslationsAPI/api/v1/',
    //permitsURL: 'https://permit-service.preciseparklink.com/images/',

    //DEV
    apiPermitsURL: 'https://permitapi.preciserd.com/Permits/PermitApi/api/v1/',
    apiTranslationServiceURL: 'https://permitapi.preciserd.com/Permits/TranslationService/api/v1/',
    permitsURL: 'https://permitapi.preciserd.com/images/',

    //Local
    //apiPermitsURL: 'https://localhost:7198/api/v1/',
    //apiTranslationServiceURL: 'https://localhost:7068/api/v1/',
    //permitsURL: 'https://localhost:7198/images/',
    appName: 'client',
    setMode: 'qa',
    production: false
  };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
  