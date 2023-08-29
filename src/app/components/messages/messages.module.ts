import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageListComponent } from './message-list/message-list.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TranslationsModule } from '../shared/translations.module';
import { MessagesRoutingModule } from './messages-routing.module';
import { RippleModule } from 'primeng/ripple';
import { TabMenuModule } from 'primeng/tabmenu';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { EditorModule } from 'primeng/editor';
import { MessageHomeComponent } from './message-home/message-home.component';
import { MessageInboxComponent } from './message-inbox/message-inbox.component';
import { MenuModule } from 'primeng/menu';
import { MessagesSidebarComponent } from './messages-sidebar/messages-sidebar.component';
import { MessageSentComponent } from './message-sent/message-sent.component';
import { MessageStarredComponent } from './message-starred/message-starred.component';
import { MessageTrashComponent } from './message-trash/message-trash.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { MessageReplyComponent } from './message-reply/message-reply.component';
import { MessageArchivedComponent } from './message-archived/message-archived.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessagesRoutingModule,
    TabMenuModule,
    MenuModule,
    ButtonModule,
    RippleModule,
    TableModule,
    InputTextModule,
    CheckboxModule,
    AvatarModule,
    EditorModule,
    ToastModule,
    FileUploadModule,
    DialogModule,
    TranslationsModule
  ],
  declarations: [
    MessageListComponent,
    MessageHomeComponent,
    MessageInboxComponent,
    MessagesSidebarComponent,
    MessageSentComponent,
    MessageStarredComponent,
    MessageTrashComponent,
    MessageDetailComponent,
    MessageReplyComponent,
    MessageArchivedComponent
  ],

})
export class MessagesModule { }
