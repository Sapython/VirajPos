import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveKotComponent } from './active-kot.component';
import { KotItemComponent } from './kot-item/kot-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    ActiveKotComponent,
    KotItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule
  ],
  exports:[
    ActiveKotComponent
  ]
})
export class ActiveKotModule { }
