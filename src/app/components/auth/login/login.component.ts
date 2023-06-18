import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginRequest } from 'src/app/models/auth/login-request.model';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	templateUrl: './login.component.html',
    providers: [MessageService]
})
export class LoginComponent implements OnInit {
	rememberMe: boolean = false;
	form!: FormGroup;
	company: Company = new Company();
    userName: string = '';
    password: string = '';

	constructor(private layoutService: LayoutService,
		private fb: FormBuilder,
        private authService: AuthService,
		private companyService: CompanyService,
        private messageService: MessageService,
		private router: Router,
		private activatedRoute: ActivatedRoute) {}

	get dark(): boolean {
		return this.layoutService.config.colorScheme !== 'light';
	}

	ngOnInit(): void {
		var user = this.authService.getLocalUser();
		if(user?.companyGuid)
			this.router.navigate(['/'+user?.companyGuid+'/'], { relativeTo: this.activatedRoute });

		this.activatedRoute.params.subscribe(params => {
		  var companyGuid = params['company'];
		  this.companyService.getCompanyConfigurations(companyGuid)
		  .subscribe({
			next: (response) => {
				if(response.succeeded ){            
					this.company = response.data!;
					this.companyService.setLocalCompany(this.company);
				}
			},
			error: (e) => {
				this.messageService.add({
					key: 'msg',
					severity: 'error',
					summary: 'Error',
					detail: e
				});
			}
		   });	
		});
		this.form = this.fb.group({
		  username: ['', [Validators.required, Validators.minLength(3)]],
		  password: ['', [Validators.required, Validators.minLength(3)]],
		  rememberMe: [false]
		});
	  }

	  onLoginClick(loginForm: FormGroup){
		var loginRequest = new LoginRequest(loginForm.value.username, loginForm.value.password, this.company.externalCompanyId!);
        this.authService.login(loginRequest)
		.subscribe({
			next: (response) => {
				if(response.succeeded ){            
				    this.authService.setLocalUser(response.data!);
					this.router.navigate(['/'+this.company.externalCompanyId+'/'], { relativeTo: this.activatedRoute });
                    return;
				}
			},
			error: (e) => {
				console.log("errorr");
				this.messageService.add({
					key: 'msg',
					severity: 'error',
					summary: 'Error',
					detail: e	
				});
			}
		   });
	  }
}
