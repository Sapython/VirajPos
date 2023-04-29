import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveKotComponent } from './active-kot.component';
import { KotItemComponent } from './kot-item/kot-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BaseComponentsModule } from 'src/app/base-components/base-components.module';
import { MergedProductsPipe } from './merged-products.pipe';



@NgModule({
  declarations: [
    ActiveKotComponent,
    KotItemComponent,
    MergedProductsPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    BaseComponentsModule
  ],
  exports:[
    ActiveKotComponent,
    KotItemComponent
  ]
})
export class ActiveKotModule { }
