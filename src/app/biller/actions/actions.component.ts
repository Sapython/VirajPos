import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataProvider } from 'src/app/provider/data-provider.service';
import { AddDiscountComponent } from './add-discount/add-discount.component';
import { CancelComponent } from './cancel/cancel.component';
import { NonChargeableComponent } from './non-chargeable/non-chargeable.component';
import { SettleComponent } from './settle/settle.component';
import { CustomerPanelComponent } from '../customer-panel/customer-panel.component';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {
  @Input() billNo:number = 0;
  @Input() billTokenNo:number = 0;
  @Input() billAmount:number = 0;
  @Input() tableNo:number = 0;
  @Input() billTime:number = 0;
  @Output() printKot = new EventEmitter();
  @Output() raiseConcern = new EventEmitter();
  isNonChargeable:boolean = false;
  seeMore:boolean = false;
  constructor(public dataProvider:DataProvider,private dialog:Dialog){}

  cancelBill(){
    if(this.dataProvider.currentBill){
      let dialog = this.dialog.open(CancelComponent)
      dialog.closed.subscribe((result:any)=>{
        if(result.reason && result.phone) {
          this.dataProvider.currentBill?.cancel(result.reason,result.phone)
        }
      })
    }
  }

  finalizeBill(){
    if(this.dataProvider.currentBill){
      this.dataProvider.currentBill.finalize()
    }
  }

  settleBill(){
    if (this.dataProvider.currentBill) {
      let dialog = this.dialog.open(SettleComponent)
      dialog.closed.subscribe((result:any)=>{
        if(this.dataProvider.currentBill && result.settling){
          this.dataProvider.currentBill.settle(result.customerName || '',result.customerContact || '',result.paymentMethod || '',result.cardEnding || '',result.upiAddress || '')
        }
      })
    }
  }

  addDiscount(){
    const dialog = this.dialog.open(AddDiscountComponent)
    dialog.closed.subscribe((result:any)=>{
      if(this.dataProvider.currentBill && result.discounted){
        this.dataProvider.currentBill.addDiscount(result.discount)
      }
    })
  }

  nonChargeable(event:any){
    console.log(event);
    if(this.dataProvider.currentBill && event.checked){
      const dialog = this.dialog.open(NonChargeableComponent)
      dialog.closed.subscribe((result:any)=>{
        if (!result || !result.nonChargeable){
          this.isNonChargeable = false;
          return;
        }
        if (this.dataProvider.currentBill && result.nonChargeable){
          this.dataProvider.currentBill.setAsNonChargeable(result.name || '',result.phone || '',result.reason || '')
        }
      })
    } else if(this.dataProvider.currentBill && !event.checked){
      this.dataProvider.currentBill.setAsNormal()
    }
  }

  addCustomerInfo(){
    const dialog = this.dialog.open(CustomerPanelComponent)
    // dialog.afterClosed().subscribe((result)=>{})
  }
}
