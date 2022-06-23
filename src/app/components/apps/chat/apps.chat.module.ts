import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppsChatRoutingModule } from './apps.chat-routing.module';
import { AppsChatComponent } from './apps.chat.component';
import { ChatSidebarComponent } from './chat-sidebar/chat-sidebar.component';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BadgeModule } from 'primeng/badge';
import { UserCardComponent } from './user-card/user-card.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatService } from './service/chat.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppsChatRoutingModule,
    AvatarModule,
    InputTextModule,
    ButtonModule,
    BadgeModule,
    MenuModule,
    OverlayPanelModule
  ],
  declarations: [
    ChatSidebarComponent,
    AppsChatComponent,
    UserCardComponent,
    ChatBoxComponent
  ],
  providers: [
    ChatService
  ]
})
export class AppsChatModule { }
