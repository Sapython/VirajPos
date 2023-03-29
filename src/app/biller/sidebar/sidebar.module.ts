import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { MenuComponent } from './menu/menu.component';
import { CategoryCardComponent } from './menu/category-card/category-card.component';
import { StockComponent } from './stock/stock.component';
import { DispenseComponent } from './stock/dispense/dispense.component';
import { OptionComponent } from './menu/option/option.component';
import { MenuItemComponent } from './menu/option/menu-item/menu-item.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { EditMenuComponent } from './edit-menu/edit-menu.component';
import { ReceiveStockComponent } from './stock/receive-stock/receive-stock.component';
import { DispersionComponent } from './stock/dispersion/dispersion.component';
import { CloseInComponent } from './stock/close-in/close-in.component';
import { DispenseSmallComponent } from './stock/dispense-small/dispense-small.component';
import { ReceivingSmallComponent } from './stock/receiving-small/receiving-small.component';
import { ReceivingComponent } from './stock/receiving/receiving.component';
import { SidebarComponent } from './sidebar.component';
import { BrandingComponent } from './info-panel/branding/branding.component';
import { PopoverModule } from 'src/app/popover/popover.module';
import {MatIconModule} from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip'; 
import {MatRippleModule} from '@angular/material/core'; 

import {OverlayModule} from '@angular/cdk/overlay';
import { SalesSummaryComponent } from './info-panel/sales-summary/sales-summary.component';
import { OrderSummaryComponent } from './info-panel/order-summary/order-summary.component';
import { StockListComponent } from './menu/stock-list/stock-list.component';
import { StockValuationComponent } from './stock/stock-valuation/stock-valuation.component';
import { CashCounterComponent } from './stock/cash-counter/cash-counter.component'; 
import { DialogModule } from '@angular/cdk/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import {MatSliderModule} from '@angular/material/slider'; 
import { AddNewCategoryComponent } from './edit-menu/add-new-category/add-new-category.component';
import {MatTabsModule} from '@angular/material/tabs'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpersModule } from 'src/app/helpers/helpers.module';
import {MatStepperModule} from '@angular/material/stepper';
import { AddDishComponent } from './edit-menu/add-dish/add-dish.component';
import { MatSelectModule } from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import { ReportsComponent } from './info-panel/sales-summary/reports/reports.component'; 

@NgModule({
  declarations: [
    InfoPanelComponent,
    MenuComponent,
    CategoryCardComponent,
    StockComponent,
    ReceivingComponent,
    DispenseComponent,
    ReceivingSmallComponent,
    DispenseSmallComponent,
    OptionComponent,
    MenuItemComponent,
    InventoryListComponent,
    ReceiveStockComponent,
    DispersionComponent,
    CloseInComponent,
    SidebarComponent,
    BrandingComponent,
    SalesSummaryComponent,
    OrderSummaryComponent,
    StockListComponent,
    StockValuationComponent,
    CashCounterComponent,
    EditMenuComponent,
    AddNewCategoryComponent,
    AddDishComponent,
    ReportsComponent,
  ],
  imports: [
    CommonModule,
    PopoverModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatRippleModule,
    OverlayModule,
    DialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    HelpersModule,
    MatStepperModule,
    MatSelectModule,
    MatMenuModule
  ],
  exports:[SidebarComponent]
})
export class SidebarModule { }
