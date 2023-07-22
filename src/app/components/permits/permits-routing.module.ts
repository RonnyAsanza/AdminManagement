import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { PermitInformationComponent } from './permit-information/permit-information.component';
import { ApplicationInformationComponent } from './application-information/application-information.component';
import { PermitHomeComponent } from './permit-home/permit-home.component';

const routes: Routes = [
  {
    path: "",
    children: [
      { 
        path: '', component: PermitHomeComponent,
        data: { breadcrumb: 'Home' }, 
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
