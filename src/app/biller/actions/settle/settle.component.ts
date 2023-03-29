import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataProvider } from 'src/app/provider/data-provider.service';

@Component({
  selector: 'app-settle',
  templateUrl: './settle.component.html',
  styleUrls: ['./settle.component.scss']
})
export class SettleComponent {
  percentageSplitForm:FormGroup = new FormGroup({})
  percentageSplits:FormControl[] = []
  percentageValueError:boolean = false
  settleBillForm:FormGroup = new FormGroup({
    paymentMethod: new FormControl(''),
    cardEnding: new FormControl(''),
    upiAddress: new FormControl(''),
    customerName: new FormControl(''),
    customerContact: new FormControl(''),
    recipents: new FormControl(''),
    splitMethod: new FormControl(''),
    percentageSplitForm:this.percentageSplitForm
  })
  constructor(private dialogRef:DialogRef,public dataProvider:DataProvider){
    this.settleBillForm.valueChanges.subscribe((value)=>{
      this.percentageSplits = []
      console.log(value);
      if (Number(value.recipents) > 0){
        this.percentageSplitForm = new FormGroup({})
        for (let i = 0; i < Number(value.recipents); i++){
          let control = new FormControl('',Validators.required)
          this.percentageSplitForm.addControl(`recipent${i}`,control)
          this.percentageSplits.push(control)
        }
      }
    })
    this.percentageSplitForm.valueChanges.subscribe((value)=>{
      let total = 0
      for (let key in value){
        total += Number(value[key])
      }
      if (total > 100){
        this.percentageValueError = true
      } else if (total == 100){
        this.percentageValueError = false
      } else {
        this.percentageValueError = true
      }
    })
  }

  close(){
    this.dialogRef.close()
  }
  
  settleBill(){
    this.dialogRef.close({...this.settleBillForm.value,settling:true});
  }
}
