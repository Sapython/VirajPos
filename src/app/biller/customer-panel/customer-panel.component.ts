import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { DataProvider } from 'src/app/provider/data-provider.service';

@Component({
  selector: 'app-customer-panel',
  templateUrl: './customer-panel.component.html',
  styleUrls: ['./customer-panel.component.scss']
})
export class CustomerPanelComponent {
  customerInfoForm:FormGroup = new FormGroup({
    name: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
  });
  @Input() orderFrequency: number = 0;
  @Input() lastMonth: string = "Jan";
  @Input() averageOrderPrice: number = 300;
  @Input() lastOrderDish: string[] = ["Chicken",'Rice','Salad'];

  constructor(private dataProvider:DataProvider) {
    this.customerInfoForm.valueChanges.pipe(debounceTime(1000)).subscribe((value)=>{
      this.dataProvider.currentBill?.setCustomerInfo(value)
      console.log("value",this.dataProvider.currentBill?.customerInfo);
      
    })
  }

  wordsToSentence(words: string[]): string {
    let sentence = "";
    for (let i = 0; i < words.length; i++) {
      sentence += words[i];
      if (i < words.length - 1) {
        // add and and ,
        if (i == words.length - 2) {
          sentence += " and ";
        } else {
          sentence += ", ";
        }
      } else {
        sentence += ".";
      }
    }
    return sentence;
  }
}
