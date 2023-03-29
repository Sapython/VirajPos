import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import fuse
import Fuse from 'fuse.js';
import { debounceTime } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-category.component.html',
  styleUrls: ['./add-new-category.component.scss']
})
export class AddNewCategoryComponent {
  maxPrice: number = 100;
  products:any[] = []
  searchResults:any[] = []
  newCategoryForm:FormGroup = new FormGroup({
    name: new FormControl('',Validators.required),
    search: new FormControl(''),
  })
  constructor(private dialogRef:DialogRef,@Inject(DIALOG_DATA) private dialogData:any,private databaseService:DatabaseService){
    this.products = dialogData.products || [];
    this.newCategoryForm.valueChanges.pipe(debounceTime(600)).subscribe((value)=>{
      // use fuse
      let fuse = new Fuse(this.products, {
        keys: ['name','price'],
      })
      this.searchResults = fuse.search(value.search).map(item => item.item);
    })
  }
  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }

  cancel(){
    this.dialogRef.close();
  }

  addCategory(){
    let selectedItems = this.products.filter(item => item.selected);
    // let averagePrice = selectedItems.reduce((acc, item) => acc + item.price, 0) / selectedItems.length;
    let category = {
      name: this.newCategoryForm.value.name,
      id: this.randomIdGenerator()
    }
    selectedItems.forEach(item => {
      item.category = category;
      console.log(item);
      this.databaseService.updateRecipe(item);
    })
  }

  randomIdGenerator(){
    return Math.random().toString(36).substr(2, 9);
  }
}
