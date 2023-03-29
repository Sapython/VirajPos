import { Timestamp } from '@angular/fire/firestore';
import { KotConstructor, Product } from './constructors';

export class Kot implements KotConstructor {
  id: string;
  createdDate: Timestamp;
  stage: 'active' | 'finalized' | 'cancelled' | 'edit';
  products: Product[];
  editMode: boolean;
  selected: boolean;
  allSelected: boolean;
  totalTimeTaken: string;
  totalTimeTakenNumber: number;
  someSelected: boolean;
  constructor(id: string, product: Product) {
    this.id = id;
    this.createdDate = Timestamp.now();
    this.stage = 'active';
    this.products = [product];
    this.editMode = false;
    this.selected = false;
    this.totalTimeTakenNumber = 0;
    this.totalTimeTaken = '0h 0m 0s';
    this.allSelected = false;
    this.someSelected = false;
    this.toObject = this.toObject.bind(this);
    this.calculateTotalTimeTaken();
  }

  selectAll(event: any) {
    const value = event.checked;
    this.products.forEach((item) => (item.selected = value));
  }
  checkAll() {
    this.allSelected = this.products.every((item) => item.selected);
    this.someSelected =
      this.products.some((item) => item.selected) && !this.allSelected;
  }

  convertProductsToObject():Product[] {
    return this.products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        type: product.type,
        tags: product.tags || [],
        quantity: product.quantity,
        variants: product.variants,
        selected: product.selected,
      };
    });
  }
  
  getTime(date:Timestamp){
    let milliseconds =(new Date()).getTime() - (date.toDate().getTime());
    // convert milliseconds to minutes and seconds
    let minutes = Math.floor(milliseconds / 60000);
    let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
  }

  calculateTotalTimeTaken() {
    setInterval(() => {
      let time = this.getTime(this.createdDate);
      this.totalTimeTaken = time;
      this.totalTimeTakenNumber = Number(time.split(':')[0]) * 60 + Number(time.split(':')[1]);
    },1000)
  }

  toObject() {
    return {
      id: this.id,
      createdDate: this.createdDate,
      products: this.convertProductsToObject(),
      stage: this.stage,
      selected: this.selected,
      allSelected: this.allSelected,
      editMode: this.editMode,
      someSelected: this.someSelected,
    };
  }
}
