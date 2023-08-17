import { NgModule } from '@angular/core';
import { TranslatePipe } from './pipes/translate.pipe';

@NgModule({
  declarations: [
   TranslatePipe
  ],
  imports: [   
  ],
  exports: [
    TranslatePipe
  ],
  providers: [
],
})
export class TranslationsModule { }