import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { MessageService } from 'primeng/api';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChangePasswordViewModel } from 'src/app/models/auth/change-password.model';
import { from } from 'rxjs';

@Component({
	templateUrl: './newpassword.component.html',
	styleUrls: ['./newpassword.component.scss'],
	providers: [MessageService]
})
export class NewPasswordComponent implements OnInit {
	company!: Company;
	form!: FormGroup;
	notSame: boolean= false;
	portalUserKey!:string;
	token!:string;
	rememberMe: boolean = false;

    constructor(private layoutService: LayoutService,
		private activatedRoute: ActivatedRoute,
		private companyService: CompanyService,
		private authService: AuthService,
		private messageService: MessageService,
		private router: Router,
		private fb: FormBuilder) {}


	get dark(): boolean {
		return this.layoutService.config.colorScheme !== 'light';
	}


	ngOnInit(): void {
		from(this.companyService.getLocalCompany())
		.subscribe(value => {
		  this.company = value;
		});

		this.form = this.fb.group({
			password: ['', [Validators.required, Validators.minLength(3)]],
			confirmPassword: ['', [Validators.required, Validators.minLength(3)]]
		  }, { validators: this.checkPassword })

		  this.activatedRoute.params.subscribe(params => {
			var companyAlias = params['company'];
			this.portalUserKey = params['user'];
			this.token = params['token'];
			this.getCompanyConfigurations(companyAlias);
			});
	}

	checkPassword: ValidatorFn = (form: AbstractControl):  ValidationErrors | null => {
		let password = form.value.password;
		let confirmPassword = form.value.confirmPassword;
		this.notSame = password === confirmPassword ? false : true;
		return password === confirmPassword ? null : { notSame: true }
	  }

	onSubmit(form: FormGroup){
		const changePasswordData: ChangePasswordViewModel = {
			companyKey: this.company.companyKey,
			activationCode:  this.token,
			password: form.value.password
		};

		this.authService.changePassword(this.portalUserKey, changePasswordData)
		.subscribe({
			next: (response) => {
				if(response.succeeded ){            
					this.messageService.add({
						key: 'msg',
						severity: 'success',
						summary: 'Success',
						detail: 'Password successfully updated!'
					});
					
					setTimeout(() => {
						this.router.navigate(['/'+this.company.portalAlias+'/auth']);
						return;				  
					}, 3000);
				}
				else{
					this.messageService.add({
						key: 'msg',
						severity: 'error',
						summary: 'Error',
						detail: response.message
						});
					}
				}
		});
	}

	getCompanyConfigurations(companyAlias: string){
		this.companyService.getCompanyConfigurations(companyAlias)
		.subscribe({
			next: (response) => {
				if(response.succeeded ){            
					this.company = response.data!;
					this.companyService.setLocalCompany(this.company);
				}
				else{
					this.messageService.add({
						key: 'msg',
						severity: 'error',
						summary: 'Error',
						detail: response.message
						});
					}
				}
		});
	}
}
