import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
    templateUrl: './verification.component.html'
})

export class VerificationComponent implements OnInit {
    message:string = 'waiting for the vaidation...';
    portalUserKey:number = 0;
    constructor(private activatedRoute: ActivatedRoute,
                private layoutService: LayoutService,
                private authService: AuthService) { }

    get dark(): boolean {
    return this.layoutService.config.colorScheme !== 'light';}

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
        this.portalUserKey = params['user'];
        let activationCode = params['token'];
        this.authService.confirmEmail(this.portalUserKey, activationCode)
        .subscribe((response)=>{
                this.message = (response.succeeded)?'Your account was successfully validated.':'There was a problem verifying your email.';
            });
        });
    }
}
