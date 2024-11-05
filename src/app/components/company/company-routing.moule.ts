import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyListComponent } from './company-list/company-list.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CompanyListComponent }
	])],
	exports: [RouterModule]
})
export class CompanyRoutingModule { }
