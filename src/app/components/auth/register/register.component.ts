import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { PortalUser } from 'src/app/models/portal-user.model';
import { MessageService } from 'primeng/api';
import { from } from 'rxjs';

@Component({
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	providers: [MessageService]
})
export class RegisterComponent {
	form!: FormGroup;
	company!: Company;
	confirmed: boolean = false;
	notSame: boolean= false;

	constructor(private fb: FormBuilder,
		private router: Router,
		private layoutService: LayoutService,
		private messageService: MessageService,
		private companyService: CompanyService,
		private authService: AuthService) {

	}
	get dark(): boolean {
		return this.layoutService.config.colorScheme !== 'light';
	}

	ngOnInit(): void {
		from(this.companyService.getLocalCompany())
		.subscribe(value => {
		  this.company = value;
		});
		this.form = this.fb.group({
		  username: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
		  password: ['', [Validators.required, Validators.minLength(3)]],
		  confirmPassword: ['', [Validators.required, Validators.minLength(3)]],
		  phoneNumber: ['', [Validators.minLength(10)]],
		  firstName: [''],
		  lastName: ['']
		}, { validators: this.checkPassword })
	  }
	
	  checkPassword: ValidatorFn = (form: AbstractControl):  ValidationErrors | null => {
		let password = form.value.password;
		let confirmPassword = form.value.confirmPassword;
		this.notSame = password === confirmPassword ? false : true;
		return password === confirmPassword ? null : { notSame: true }
	  }

	  onRegisterClick(form: FormGroup){
		var portalUser = new PortalUser();
		portalUser.emailAddress = form.value.username;
		portalUser.userName = form.value.username;
		portalUser.password = form.value.password;
		portalUser.firstName = form.value.firstName;
		portalUser.lastName = form.value.lastName;
		portalUser.smsPhoneNumber = form.value.phoneNumber;
		portalUser.companyKey = this.company.companyKey;
	
		this.authService.createPortalUser(portalUser)
		.subscribe({
			next: (response) => {
				if(response.succeeded ){        
					this.messageService.add({
						key: 'msg',
						severity: 'success',
						summary: 'Success',
						detail: 'User successfully created, you will get an email to confirm you account!'
					});
					
					setTimeout(() => {
						this.router.navigate(['/'+this.company.portalAlias+'/auth']);
						return;				  
					}, 3000);
				}
				else
				{
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