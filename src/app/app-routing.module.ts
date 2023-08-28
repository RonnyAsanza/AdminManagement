import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuard } from './guards/auth.guard';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
   { path: '', data: { breadcrumb: 'Companies' }, loadChildren: () => import('./components/company/company.module').then(m => m.CompanyModule) },
   {
        path: ':company', component: AppLayoutComponent,
        children: [
            { path: '', loadChildren: () => import('./components/permits/permits.module').then(m => m.PermitsModule) },
            { path: 'messages', data: { breadcrumb: 'Messages' }, loadChildren: () => import('./components/messages/messages.module').then(m => m.MessagesModule) },
            { path: 'pages', data: { breadcrumb: 'Pages' }, loadChildren: () => import('./components/pages/pages.module').then(m => m.PagesModule) },
            { path: 'profile', data: { breadcrumb: 'User Management' }, loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfileModule) },
        ],
        canActivate: [AuthGuard],
    },
    {
        path: ':company/auth',
        loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule),
      },
    { path: 'landing', loadChildren: () => import('./components/landing/landing.module').then(m => m.LandingModule) },
    { path: 'notfound', loadChildren: () => import('./components/notfound/notfound.module').then(m => m.NotfoundModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
