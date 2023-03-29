import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemComponent } from './system.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DialogModule } from '@angular/cdk/dialog';



@NgModule({
  declarations: [
    SystemComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    DialogModule
  ],
  exports:[
    SystemComponent
  ]
})
export class SystemModule { }
