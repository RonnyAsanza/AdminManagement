import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { PermitListComponent } from './permit-list/permit-list.component';
import { PermitInformationComponent } from './permit-information/permit-information.component';
import { ApplicationInformationComponent } from './application-information/application-information.component';

const routes: Routes = [
  {
    path: "",
    children: [
      { 
        path: '', component: PermitListComponent,
        data: { breadcrumb: 'Permit List' }, 
      },
    ]
  },
  { 
    path: 'new-permit', 
    data: { breadcrumb: 'New Permit' }, 
    loadChildren: () => import('./apply-permit/apply-permit.module').then(m => m.ApplyPermitModule) 
  },
  { path: 'permits/:permitId', 
    data: { breadcrumb: 'Permit Information' }, 
    component: PermitInformationComponent 
  },
  { path: 'application/:applicationId', 
    data: { breadcrumb: 'Application Information' }, 
    component: ApplicationInformationComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PermitssRoutingModule { }
