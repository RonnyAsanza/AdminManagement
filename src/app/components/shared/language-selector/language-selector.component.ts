import { Component, OnInit } from '@angular/core';
import { LanguageModel } from 'src/app/models/language.model';
import { LanguageTransService } from 'src/app/services/language-trans.service';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  languages: LanguageModel[] = [];
  selectedLanguage!: LanguageModel;
  filteredLanguages: LanguageModel[] = [];

  constructor(
    public languageTransService: LanguageTransService,
    public translateService: TranslateService
  ) { 
  }

  ngOnInit(): void {
    this.languageTransService.getAllLanguages()
    .subscribe(async (response)=>{
      if(response.succeeded )
       {
          this.languages = response.data??[];
          var language = await this.languageTransService.getLocalLanguage();
          if(language?.languageKey)
          {
            this.selectedLanguage = language;
          }
          else
          {
            this.selectedLanguage = response.data?response.data[0]: {};
          }
          this.languageTransService.setLocalLanguage(this.selectedLanguage);
       }
      }
    );
  }

  filterLanguage(event: any) {
    let filtered: LanguageModel[] = [];
    let query = event.query;

    for (let i = 0; i < this.languages.length; i++) {
        let language = this.languages[i];
        if (language.nameEN?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(language);
        }
    }
    this.filteredLanguages = filtered;
  }

  public async onLanguageChanged(language: LanguageModel): Promise<void> {
    let localLanguage = await this.languageTransService.getLocalLanguage();
    if(localLanguage.twoLetterCode !== language.twoLetterCode)
    {
      this.translateService.LanguageChanged(language.twoLetterCode!);
      this.languageTransService.setLocalLanguage(language);
    }
  }

}
