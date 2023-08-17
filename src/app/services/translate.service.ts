import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LanguageTransService } from './language-trans.service';
import { PermitsResponse } from './permits-response.model';
import { TranslationsModel } from '../models/translations-models';

@Injectable({
  providedIn: 'root'
})

export class TranslateService {
  data: TranslationsModel[] = [];

  constructor(private http: HttpClient,
              private languageTransService: LanguageTransService) {
  }

  getTranslationsByLanguage(languageCode: string): Promise<TranslationsModel[]> {
    let localLanguage = this.languageTransService.getLocalLanguage();
    if(localLanguage != null && localLanguage.twoLetterCode == languageCode && this.data.length > 0)
    {
      return new Promise<TranslationsModel[]>(resolve => {
        resolve(this.data);
      });
    }

    return new Promise<TranslationsModel[]>(resolve => {
      var urlPath = environment.apiTranslationServiceURL + 'Translation/GetTranslationsByLanguage/'+languageCode;
      this.http.get<PermitsResponse<TranslationsModel[]>>(urlPath)
      .subscribe({
        next: (response) => {
            if(response.succeeded )
            {
                this.data = response.data??[];
                resolve(this.data);
            }
        },
        error: (e) => {
          this.data = [];
          resolve(this.data);
        }
    });
  });

 }

 setInitialLanguage(languageCode: string): Promise<TranslationsModel[]> {
  let localLanguage = this.languageTransService.getLocalLanguage();
  languageCode = (localLanguage == null)? languageCode: localLanguage.twoLetterCode!;
  return this.getTranslationsByLanguage(languageCode);
}

 LanguageChanged(languageCode: string): Promise<TranslationsModel[]> {
  return this.getTranslationsByLanguage(languageCode);
}

}
