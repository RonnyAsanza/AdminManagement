import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        RegisterRoutingModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        CheckboxModule,
        ReactiveFormsModule,
        AppConfigModule,
        MessageModule,
        MessagesModule,
        ToastModule,
        PasswordModule,
        SharedModule
    ],
    declarations: [RegisterComponent]
})
export class RegisterModule { }
