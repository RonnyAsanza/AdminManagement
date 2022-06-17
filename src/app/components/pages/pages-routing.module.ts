import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'about', loadChildren: () => import('./about/app.about.module').then(m => m.AppAboutModule) },
        { path: 'contact', loadChildren: () => import('./contact/app.contact.module').then(m => m.AppContactModule) },
        { path: 'crud', loadChildren: () => import('./crud/app.crud.module').then(m => m.AppCrudModule) },
        { path: 'empty', loadChildren: () => import('./empty/app.emptydemo.module').then(m => m.AppEmptyDemoModule) },
        { path: 'faq', loadChildren: () => import('./faq/app.faq.module').then(m => m.AppFaqModule) },
        { path: 'help', loadChildren: () => import('./help/app.help.module').then(m => m.AppHelpModule) },
        { path: 'invoice', loadChildren: () => import('./invoice/app.invoice.module').then(m => m.AppInvoiceModule) },
        { path: 'pricing', loadChildren: () => import('./pricing/app.pricing.module').then(m => m.AppPricingModule) },
        { path: 'timeline', loadChildren: () => import('./timeline/app.timelinedemo.module').then(m => m.AppTimelineDemoModule) }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
