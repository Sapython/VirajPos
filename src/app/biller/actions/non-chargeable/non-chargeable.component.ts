import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataProvider } from 'src/app/provider/data-provider.service';

@Component({
  selector: 'app-non-chargeable',
  templateUrl: './non-chargeable.component.html',
  styleUrls: ['./non-chargeable.component.scss']
})
export class NonChargeableComponent {
  nonChargeableForm:FormGroup = new FormGroup({
    reason:new FormControl('',Validators.required),
    phone:new FormControl('',[Validators.required,Validators.pattern('[0-9]{10}')]),
    name:new FormControl('',Validators.required),
    password:new FormControl('',Validators.required)
  });
  constructor(private dialogRef:DialogRef,private dataProvider:DataProvider){}
  submit(){
    if (this.nonChargeableForm.invalid) return;
    if (this.nonChargeableForm.value.password === this.dataProvider.password){
      this.dialogRef.close({...this.nonChargeableForm.value,nonChargeable:true})
    } else {
      alert('Wrong Password')
    }
  }
}
