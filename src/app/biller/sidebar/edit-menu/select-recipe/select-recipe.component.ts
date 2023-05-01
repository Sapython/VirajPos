import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, Input } from '@angular/core';
import { Product } from 'src/app/biller/constructors';

@Component({
  selector: 'app-select-recipe',
  templateUrl: './select-recipe.component.html',
  styleUrls: ['./select-recipe.component.scss'],
})
export class SelectRecipeComponent {
  @Input() editMode: boolean = false;
  constructor(
    @Inject(DIALOG_DATA) public products: Product[],
    private dialogRef: DialogRef
  ) {}
  save() {
    this.dialogRef.close(this.products);
  }
  close() {
    this.dialogRef.close();
  }

  switchAll(event:any){
    this.products.forEach((product:Product)=>{
      product.selected = event.checked;
    })
  }
}
