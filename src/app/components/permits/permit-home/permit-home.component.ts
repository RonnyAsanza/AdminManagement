import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { MessageService } from 'primeng/api';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { PermitService } from 'src/app/services/permit.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-permit-home',
  templateUrl: './permit-home.component.html',
  styleUrls: ['./permit-home.component.scss'],
  providers: [MessageService, TranslatePipe]

})
export class PermitHomeComponent implements OnInit{
  company!: Company;
  items!: MenuItem[];
  activeItem!: MenuItem;
  tabIndex: number = 0;
  errorMessageSubscription: Subscription | undefined;

  constructor(private companyService: CompanyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslatePipe,
    private messageService: MessageService,
    private permitService: PermitService,
    ) {
    }

  ngOnInit(): void { 
    this.items = [
      {
          label: this.translate.transform('ClientPermit.Activity'), icon: 'pi pi-fw pi-home',
          command: (event: any) => {
            this.tabIndex = 0;
          }
      },
      {
          label: this.translate.transform('ClientPermit.Applications'), icon: 'pi pi-fw pi-pencil',
          command: (event: any) => {
          this.tabIndex = 1;
        }
      },
      {
          label: this.translate.transform('ClientPermit.Permits'), icon: 'pi pi-fw pi-calendar',
          command: (event: any) => {
          this.tabIndex = 2;
        }
      }
      ];
    this.activeItem = this.items[0];

    this.company = this.companyService.getLocalCompany();
    if(this.company == null)
    {
      this.activatedRoute.params.subscribe(params => {
        let companyAlias = params['company'];
        this.router.navigate(['/'+companyAlias+'/auth']);
      });
    }

    this.activatedRoute.params.subscribe(params => {
      let index = parseInt(params['tabIndex'], 10);
      if (!isNaN(index)) 
        this.tabIndex = index;
    });

    this.errorMessageSubscription = this.permitService.errorMessage$.subscribe((message) => {
      if (message) {
        this.showErrorMessage(message);
      }
    });
  }

  onClickNewPermit(){
    this.router.navigate(['/'+this.company.portalAlias+'/new-permit']);
  }

  async showErrorMessage(errorMessage: string){
    setTimeout(() => {
      this.messageService.add({
        key: 'msg',
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 10000
      });
      this.permitService.clearError();
    })
  }

  ngOnDestroy(): void {
    // Unsubscribe from the errorMessage$ observable when the component is destroyed
    if (this.errorMessageSubscription) {
      this.errorMessageSubscription.unsubscribe();
    }
  }
}
