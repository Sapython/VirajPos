import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrls: ['./add-dish.component.scss']
})
export class AddDishComponent {
  tags:string[] = [
    'veg',
    'non-veg',
  ];
  variants:{variantName:string,price:number}[] = []
  newDishForm:FormGroup = new FormGroup({
    name: new FormControl('',Validators.required),
    price: new FormControl('',Validators.required),
    type: new FormControl('',Validators.required),
    variants: new FormControl(this.variants),
  });

  constructor(private databaseService:DatabaseService) { }

  addVariant(){
    this.variants.push({variantName:'',price:0});
  }

  removeVariant(i:number){
    this.variants.splice(i,1);
  }

  addDish(){
    this.databaseService.addRecipe(this.newDishForm.value);
  }

}
