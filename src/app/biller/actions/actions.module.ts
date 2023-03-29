import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionsComponent } from './actions.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CancelComponent } from './cancel/cancel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SettleComponent } from './settle/settle.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AddDiscountComponent } from './add-discount/add-discount.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NonChargeableComponent } from './non-chargeable/non-chargeable.component';


@NgModule({
  declarations: [
    ActionsComponent,
    CancelComponent,
    SettleComponent,
    AddDiscountComponent,
    NonChargeableComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatIconModule
  ],
  exports:[
    ActionsComponent
  ]
})
export class ActionsModule { }
