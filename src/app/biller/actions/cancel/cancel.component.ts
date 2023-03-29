import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.scss']
})
export class CancelComponent {
  cancelForm:FormGroup = new FormGroup({
    reason: new FormControl('',Validators.required),
    phone: new FormControl('',Validators.required)
  })
  constructor(private dialogRef:DialogRef){}

  close(){
    this.dialogRef.close()
  }

  cancelBill(){
    this.dialogRef.close(this.cancelForm.value)
  }
}
