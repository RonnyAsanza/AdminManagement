import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectZoneComponent } from './select-zone/select-zone.component';
import { SelectPermittypeComponent } from './select-permittype/select-permittype.component';
import { PermitOptionsComponent } from './permit-options/permit-options.component';
import { NewPermitComponent } from './new-permit/new-permit.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { ToolbarModule } from 'primeng/toolbar';
import { ApplyPermitRoutingModule } from './applypermit-routing.module';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { PanelModule } from 'primeng/panel';
import { InputNumberModule } from "primeng/inputnumber";
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { TranslationsModule } from '../../shared/translations.module';
import { NoSpecialCharactersDirective } from '../../directives/no-special-characters.directive';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    MessagesModule,
    MessageModule,
    InputNumberModule,
    ToastModule,
    ToolbarModule,
    FormsModule,
    AppConfigModule,
    ReactiveFormsModule,
    TabViewModule,
    CardModule,
    DropdownModule,
    CalendarModule,
    PanelModule,
    FileUploadModule,
    DialogModule,
    ApplyPermitRoutingModule,
    TranslationsModule
    
  ],
  declarations: [
    SelectZoneComponent,
    SelectPermittypeComponent,
    PermitOptionsComponent,
    NewPermitComponent,
    NoSpecialCharactersDirective
  ]
})
export class ApplyPermitModule { }
