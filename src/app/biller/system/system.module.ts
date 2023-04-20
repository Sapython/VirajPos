import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemComponent } from './system.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DialogModule } from '@angular/cdk/dialog';
import { ChatComponent } from './chat/chat.component';
import { BaseComponentsModule } from 'src/app/base-components/base-components.module';



@NgModule({
  declarations: [
    SystemComponent,
    ChatComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    DialogModule,
    BaseComponentsModule
  ],
  exports:[
    SystemComponent
  ]
})
export class SystemModule { }
