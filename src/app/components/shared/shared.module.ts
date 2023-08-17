import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpConfigInterceptor } from 'src/app/interceptors/httpconfig.interceptor';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderComponent } from './loader/loader.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { LoaderService } from 'src/app/services/loader.service';
import { TranslateService } from 'src/app/services/translate.service';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';

export function setupTranslateServiceFactory(
  service: TranslateService): Function {
  return () => service.setInitialLanguage('EN');
}

@NgModule({
  declarations: [
    LoaderComponent,
    LanguageSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    HttpClientModule,
    ProgressSpinnerModule,
    OverlayPanelModule

  ],
  exports: [
    LoaderComponent,
    LanguageSelectorComponent
  ],
  providers: [
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateServiceFactory,
      deps: [
        TranslateService
      ],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true},
],
})
export class SharedModule { }
