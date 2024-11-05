import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from 'src/app/services/translate.service';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(key: any): any {
    if(this.translate.data === null)
      return key;

    return this.translate.data.find(translation => translation.labelCode == key)?.textValue || key;
  }

}