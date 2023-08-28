import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { MessageHomeComponent } from './message-home/message-home.component';
import { MessageInboxComponent } from './message-inbox/message-inbox.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { MessageArchivedComponent } from './message-archived/message-archived.component';
import { MessageSentComponent } from './message-sent/message-sent.component';
import { MessageStarredComponent } from './message-starred/message-starred.component';
import { MessageTrashComponent } from './message-trash/message-trash.component';

@NgModule({
  imports: [RouterModule.forChild([
      {
          path: '', component: MessageHomeComponent, children: [
              { path: '', redirectTo: 'inbox', pathMatch: 'full' },
              { path: 'inbox', data: { breadcrumb: 'inbox' }, component: MessageInboxComponent },
              { path: 'detail/:id', data: { breadcrumb: 'Detail' }, component: MessageDetailComponent },
              { path: 'archived', data: { breadcrumb: 'Archived' }, component:  MessageArchivedComponent},
              { path: 'sent', data: { breadcrumb: 'Sent' }, component: MessageSentComponent },
              { path: 'starred', data: { breadcrumb: 'Starred' }, component: MessageStarredComponent },
              { path: 'trash', data: { breadcrumb: 'Trash' }, component: MessageTrashComponent }
          ]
      }
  ])],
  exports: [RouterModule]
})
export class MessagesRoutingModule { }
