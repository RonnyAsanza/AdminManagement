import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { NewPermitComponent } from './new-permit/new-permit.component';

const routes: Routes = [
  {
    path: "",
    children: [
      { path: '', component: NewPermitComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ApplyPermitRoutingModule { }
