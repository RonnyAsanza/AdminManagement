import { Injectable  } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LanguageModel } from '../models/language.model';
import { PermitsResponse } from './permits-response.model';

@Injectable({
  providedIn: 'root'
})

export class LanguageTransService {
  constructor(private http: HttpClient) {
  }

  getAllLanguages(): Observable<PermitsResponse<LanguageModel[]>>{
    var urlPath = environment.apiTranslationServiceURL + 'Language';
    return this.http.get<PermitsResponse<LanguageModel[]>>(urlPath);
  }

  setLocalLanguage(language: LanguageModel) {
    let languageJsonString = JSON.stringify(language);
    localStorage.setItem('language',languageJsonString);
  }

  getLocalLanguage(): LanguageModel {
    let languageJsonString = localStorage.getItem('language');
   if (languageJsonString == 'undefined')
         return {};
    return JSON.parse(languageJsonString!);
  }

}
