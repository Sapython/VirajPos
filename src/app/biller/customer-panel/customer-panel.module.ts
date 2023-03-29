import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerPanelComponent } from './customer-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [CustomerPanelComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule
  ],
  exports:[
    CustomerPanelComponent
  ]
})
export class CustomerPanelModule { }
