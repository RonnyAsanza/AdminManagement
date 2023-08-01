// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    //apiPermitsURL: 'https://192.168.1.131/Permits/PermitApi/api/v1/',
    apiPermitsURL: 'https://localhost:7198/api/v1/',
    //apiPermitsURL: 'http://192.168.1.50:8009/api/v1/',
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
  