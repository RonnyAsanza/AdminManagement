import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
    templateUrl: './forgotpassword.component.html',
	providers: [MessageService]

})
export class ForgotPasswordComponent implements OnInit {
	company!: Company;
	form!: FormGroup;

    constructor(private layoutService: LayoutService,
		private router: Router,
		private companyService: CompanyService,
		private authService: AuthService,
		private messageService: MessageService,
		private activatedRoute: ActivatedRoute,
		private fb: FormBuilder) {}

	get dark(): boolean {
		return this.layoutService.config.colorScheme !== 'light';
	}

	ngOnInit(): void {
		var localCompany = this.companyService.getLocalCompany();
		var companyAlias = "";

		this.activatedRoute.params.subscribe(params => {
		  companyAlias = params['company'];
		});

		this.getCompanyConfigurations(companyAlias);

		if(!this.company)
			this.company = localCompany;

		this.form = this.fb.group({
			email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
		})
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

	onSubmit(form: FormGroup){
		this.authService.resetPassword(form.value.email, this.company.companyKey!)
		.subscribe({
			next: (response) => {
				if(response.succeeded ){            
					this.messageService.add({
						key: 'msg',
						severity: 'success',
						summary: 'Success',
						detail: 'You will get an email to reset your password!'
					});
					
					setTimeout(() => {
						this.router.navigate(['/'+this.company.portalAlias+'/auth']);
						return;				  
					}, 2000);
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
