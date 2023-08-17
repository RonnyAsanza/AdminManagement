import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { MessageService } from 'primeng/api';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface Image {
  name: string;
  objectURL: string;
}

@Component({
  selector: 'app-permit-home',
  templateUrl: './permit-home.component.html',
  styleUrls: ['./permit-home.component.scss'],
  providers: [MessageService, TranslatePipe]

})
export class PermitHomeComponent implements OnInit {
  company!: Company;
  items!: MenuItem[];
  activeItem!: MenuItem;
  tabIndex: number = 0;
  constructor(private companyService: CompanyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslatePipe) { }

  ngOnInit(): void { 
    this.items = [
      {
          label: this.translate.transform('ClientPermit.Activity'), icon: 'pi pi-fw pi-home',
          command: (event: any) => {
            this.tabIndex =0;
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

  }

  onClickNewPermit(){
    this.router.navigate(['/'+this.company.portalAlias+'/new-permit']);
  }
}
