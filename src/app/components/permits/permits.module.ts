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
    PermitssRoutingModule
  ],
  declarations: [
    PermitListComponent,
    PermitInformationComponent
  ],

})
export class PermitsModule { }
