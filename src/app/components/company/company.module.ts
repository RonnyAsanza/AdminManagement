import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyRoutingModule } from './company-routing.moule';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '../shared/shared.module';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CompanyRoutingModule,
		ButtonModule,
		SharedModule,
		TableModule,
		ToastModule,
		InputTextModule
	],
  declarations: [CompanyListComponent]
})
export class CompanyModule { }
