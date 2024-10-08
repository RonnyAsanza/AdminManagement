import { Injectable  } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LanguageModel } from '../models/language.model';
import { PermitsResponse } from './permits-response.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})

export class LanguageTransService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
  }

  getAllLanguages(): Observable<PermitsResponse<LanguageModel[]>>{
    var urlPath = environment.apiTranslationServiceURL + 'Language';
    return this.http.get<PermitsResponse<LanguageModel[]>>(urlPath);
  }

  setLocalLanguage(language: LanguageModel) {
    this.localStorageService.setObject('language',language);
  }

  async getLocalLanguage(): Promise<any> {
    var language = await this.localStorageService.getObject('language');
    return language;
  }
}
