import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Discount } from '../../constructors';

@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrls: ['./add-discount.component.scss']
})
export class AddDiscountComponent {
  mode:'codeBased'|'directPercent'|'directFlat'='directPercent';
  discountForm:FormGroup = new FormGroup({
    mode:new FormControl('directPercent'),
    percent:new FormControl(0),
    code:new FormControl(''),
    amount:new FormControl(0)
  });
  constructor(private dialogRef:DialogRef) {
    this.discountForm.get('code')?.valueChanges.pipe(debounceTime(600)).subscribe((value)=>{
      // this.mode = value;
      if (value === 'DISCOUNT20'){
        this.discountForm.get('percent')?.setValue(20);
      } else {
        this.discountForm.get('percent')?.setValue(0);
      }
    })
  }
  submit(){
    console.log(this.discountForm.value);
    if (this.discountForm.value.mode == 'codeBased'){
      let discount:Discount = {
        type:'percentage',
        id:Math.random().toString(36).substr(2, 9),
        name:this.discountForm.value.code,
        value:this.discountForm.value.percent,
        totalAppliedDiscount:0
      }
      this.dialogRef.close({discount,discounted:true})
    } else if (this.discountForm.value.mode == 'directPercent'){
      let discount:Discount = {
        type:'percentage',
        id:Math.random().toString(36).substr(2, 9),
        name:'Direct Discount',
        value:this.discountForm.value.percent,
        totalAppliedDiscount:0
      }
      this.dialogRef.close({discount,discounted:true})
    } else if (this.discountForm.value.mode == 'directFlat'){
      let discount:Discount = {
        type:'flat',
        id:Math.random().toString(36).substr(2, 9),
        name:'Direct Discount',
        value:this.discountForm.value.amount,
        totalAppliedDiscount:0
      }
      this.dialogRef.close({discount,discounted:true})
    } else {
      this.dialogRef.close({discounted:false})
    }
  }

  cancel(){
    this.dialogRef.close();
  }
}
