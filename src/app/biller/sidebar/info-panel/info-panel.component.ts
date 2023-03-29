import { Component, OnChanges, OnInit } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { DataProvider } from 'src/app/provider/data-provider.service';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent implements OnInit,OnChanges{
  limitedSale:string = "0";
  isOpen = false;
  isSalesOpen = false;
  closeOrdersPanelSubscription:Subject<boolean> = new Subject<boolean>();
  closeSalesPanelSubscription:Subject<boolean> = new Subject<boolean>();
  constructor(public dataProvider:DataProvider) {
    this.dataProvider.closeAllPanel.subscribe((data)=>{
      this.isOpen = false;
      this.isSalesOpen = false;
    })
  }
  ngOnInit(): void {  
    // convert this.dataProvider.sale to string with K if greater than 1000 and L if greater than 100000
    
    // convert this.dataProvider.billToken to string with K if greater than 1000 and L if greater than 100000

    if (this.dataProvider.sale > 1000 && this.dataProvider.sale < 100000) {
      this.limitedSale = "₹"+(this.dataProvider.sale / 1000).toFixed(2) + "K";
    } else if (this.dataProvider.sale > 100000) {
      this.limitedSale = "₹"+(this.dataProvider.sale / 100000).toFixed(2) + "L";
    } else {
      this.limitedSale = "₹"+this.dataProvider.sale.toString()+'.00';
    }

    this.closeOrdersPanelSubscription.pipe(debounceTime(600)).subscribe((data)=>{
      console.log("closePanelSubscription",data);
      this.isOpen = data;
    })
    this.closeSalesPanelSubscription.pipe(debounceTime(600)).subscribe((data)=>{
      console.log("closePanelSubscription",data);
      this.isSalesOpen = data;
    })
  }
  ngOnChanges(): void {
    if (this.dataProvider.sale > 1000 && this.dataProvider.sale < 100000) {
      this.limitedSale = "₹"+(this.dataProvider.sale / 1000).toFixed(2) + "K";
    } else if (this.dataProvider.sale > 100000) {
      this.limitedSale = "₹"+(this.dataProvider.sale / 100000).toFixed(2) + "L";
    } else {
      this.limitedSale = "₹"+this.dataProvider.sale.toString()+'.00';
    }
  }

}
