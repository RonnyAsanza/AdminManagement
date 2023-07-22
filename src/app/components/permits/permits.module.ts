import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermitListComponent } from './permit-list/permit-list.component';
import { PermitssRoutingModule } from './permits-routing.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { PermitInformationComponent } from './permit-information/permit-information.component';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { DataViewModule } from 'primeng/dataview';
import { ApplicationInformationComponent } from './application-information/application-information.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { PermitHomeComponent } from './permit-home/permit-home.component';
import { TabMenuModule } from 'primeng/tabmenu';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    CardModule,
    ToolbarModule,
    AppConfigModule,
    FormsModule,
    AppConfigModule,
    ReactiveFormsModule,
    PanelModule,
    TableModule,
    FieldsetModule,
    DataViewModule,
    PermitssRoutingModule,
    TabMenuModule
  ],
  declarations: [
    PermitListComponent,
    PermitInformationComponent,
    ApplicationInformationComponent,
    ApplicationListComponent,
    ActivityListComponent,
    PermitHomeComponent
  ],

})
export class PermitsModule { }
