import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { PermitListComponent } from './permit-list/permit-list.component';
import { PermitInformationComponent } from './permit-information/permit-information.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PermitssRoutingModule { }
