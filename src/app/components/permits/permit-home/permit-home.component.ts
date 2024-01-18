import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { MessageService } from 'primeng/api';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { Subscription } from 'rxjs';
import { from } from 'rxjs';
import { MenuService } from 'src/app/layout/app.menu.service';

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
  routerChangeSubscription: Subscription | undefined;

  constructor(private companyService: CompanyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslatePipe,
    private messageService: MessageService,
    private menuService: MenuService
    ) {
    }

  ngOnInit(): void { 
    this.items = this.getDefaultTabItems();
    this.activeItem = this.items[0];

    this.getLocalCompanyAndNavigate();
    this.subscribeToRouterChanges();
  }

  onClickNewPermit(): void{
    this.router.navigate(['/'+this.company.portalAlias+'/new-permit']);
  }

  getLocalCompanyAndNavigate(): void {
    from(this.companyService.getLocalCompany())
    .subscribe(value => {
      this.company = value;
      if(this.company == null)
      {
        this.activatedRoute.params.subscribe(params => {
          let companyAlias = params['company'];
          this.router.navigate(['/'+companyAlias+'/auth']);
        });
      }
    });
  }

  notifyMenuChange(notifyConfig:{key: string, routeEvent: boolean} ): void {
    this.menuService.onMenuStateChange(notifyConfig);
  }

  getDefaultTabItems(): MenuItem[]{
    return [
      {
          label: this.translate.transform('ClientPermit.Activity'), icon: 'pi pi-fw pi-home',
          command: (event: any) => {
            this.tabIndex = 0;
            this.notifyMenuChange({key: `0-${this.tabIndex}`, routeEvent: true })
          }
      },
      {
          label: this.translate.transform('ClientPermit.Applications'), icon: 'pi pi-fw pi-pencil',
          command: (event: any) => {
          this.tabIndex = 1;
          this.notifyMenuChange({key: `0-${this.tabIndex}`,  routeEvent: true})
        }
      },
      {
          label: this.translate.transform('ClientPermit.Permits'), icon: 'pi pi-fw pi-calendar',
          command: (event: any) => {
          this.tabIndex = 2;
          this.notifyMenuChange({key: `0-${this.tabIndex}`, routeEvent: true})
        }
      }
    ];
  }

  async showErrorMessage(errorMessage: string): Promise<void>{
    setTimeout(() => {
      this.messageService.add({
        key: 'msg',
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 5000
      });
    })
  }

  subscribeToRouterChanges():void {
    this.routerChangeSubscription = this.activatedRoute.params.subscribe(params => {
      let index = parseInt(params['tabIndex'], 10);
      if (!isNaN(index)) 
        this.tabIndex = index;
        this.activeItem = this.items[this.tabIndex];
    });
  }

  ngOnDestroy(): void {
    if (this.routerChangeSubscription) {
      this.routerChangeSubscription.unsubscribe();
    }
  }
}
