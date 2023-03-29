import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { DataProvider } from 'src/app/provider/data-provider.service';
import { Category } from 'src/app/structures/general.structure';
import { AddDishComponent } from './add-dish/add-dish.component';
import { AddNewCategoryComponent } from './add-new-category/add-new-category.component';

@Component({
  selector: 'app-edit-menu',
  templateUrl: './edit-menu.component.html',
  styleUrls: ['./edit-menu.component.scss']
})
export class EditMenuComponent implements OnInit {
  public recommended:Category[] = [
    {
      name: "Recommended",
      id: "recommended",
      products: [
        {
          name: "Burger",
          price: 100,
          id: "1",
          selected: false,
          tags: [],
          type:'veg',
          variants: [],
          quantity:1
        }
      ],
      averagePrice: 0
    },
    {
      name: "Most Selling",
      id: "recommended",
      products: [
        {
          name: "Burger",
          price: 100,
          id: "1",
          selected: false,
          tags: [],
          type:'veg',
          variants: [],
          quantity:1,
        }
      ],
      averagePrice: 0
    },
    {
      name: "New Dishes",
      id: "recommended",
      products: [
        {
          name: "Burger",
          price: 100,
          id: "1",
          selected: false,
          tags: [],
          type:'veg',
          variants: [],
          quantity:1,
        }
      ],
      averagePrice: 0
    },
  ]
  allProducts:Category = {
    name: "All Products",
    id: "all",
    products: [],
    averagePrice: 0
  }
  mode:'allProducts'|'single' = 'allProducts';
  public categories:Category[] = []
  selectedCategory:Category|undefined;
  maxPrice = 1000;
  constructor(private dialog:Dialog,private dataProvider:DataProvider,private indexedDb:NgxIndexedDBService){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // firstValueFrom(this.indexedDb.getAll('categories')).then((data:any)=>{
    //   console.log("category data",data);
    //   if (data.length > 0){
    //     console.log("category data success",data);
    //     this.categories = data;
    //   }
    //   let products:any[] = []
    //   this.categories.forEach(category => {
    //     products = products.concat(category.products);
    //   });
    //   this.allProducts.products = products;
    //   // this.categories.unshift(this.allProducts);
    //   // this.categories = this.categories.concat(this.recommended);
    //   this.selectCategory(this.allProducts);
    // }).catch((err)=>{
    //   console.log("category data error",err);
    // });
    this.dataProvider.products.forEach(product => {
      this.allProducts.products.push(product);
    }) 
  }

  addRecipe(){
    this.dialog.open(AddDishComponent, {})
  }

  selectCategory(category:Category){
    this.selectedCategory = category;
    // get the maximum price of the products in the selected category
    this.maxPrice = Math.max(...category.products.map(product => product.price));

  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  addNewCategory(){
    const dialog = this.dialog.open(AddNewCategoryComponent, {data:{products:this.allProducts.products}})
  }

  getExcelFormat(){
    
  }
}
