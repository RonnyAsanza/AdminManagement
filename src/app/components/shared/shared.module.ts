import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpConfigInterceptor } from 'src/app/interceptors/httpconfig.interceptor';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderComponent } from './loader/loader.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { LoaderService } from 'src/app/services/loader.service';

@NgModule({
  declarations: [
    LoaderComponent,
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
    LoaderComponent
  ],
  providers: [
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true},
],
})
export class SharedModule { }
