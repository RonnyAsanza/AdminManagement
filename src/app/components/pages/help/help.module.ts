import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpRoutingModule } from './help-routing.module';
import { HelpComponent } from './help.component';
import { InputTextModule } from 'primeng/inputtext';
import { TranslationsModule } from '../../shared/translations.module';

@NgModule({
	imports: [
		CommonModule,
		HelpRoutingModule,
		InputTextModule,
		TranslationsModule
	],
	declarations: [HelpComponent]
})
export class HelpModule { }
