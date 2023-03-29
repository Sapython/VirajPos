import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Output } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { CloseInComponent } from './close-in/close-in.component';
import { DispenseComponent } from './dispense/dispense.component';
import { ReceiveStockComponent } from './receive-stock/receive-stock.component';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent {
  stockValuation: number = 0;
  isReceivingSummaryOpen: boolean = false;
  isCashSummaryOpen: boolean = false;
  isStockValuationOpen: boolean = false;
  closeStockValuePanelSubscription:Subject<boolean> = new Subject<boolean>();
  cashCounterPanelSubscription:Subject<boolean> = new Subject<boolean>();
  @Output() close:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private dialog:Dialog){
    this.closeStockValuePanelSubscription.pipe(debounceTime(600)).subscribe((data)=>{
      this.isStockValuationOpen = data;
    })
    this.cashCounterPanelSubscription.pipe(debounceTime(600)).subscribe((data)=>{
      this.isCashSummaryOpen = data;

    })
  }

  openReceiving(){
    const dialog = this.dialog.open(ReceiveStockComponent)
  }

  openDispersion(){
    const dialog = this.dialog.open(DispenseComponent)
  }

  closeIn(){
    const dialog = this.dialog.open(CloseInComponent)
  }
}
