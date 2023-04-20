import { AfterViewInit, Component, OnInit, ViewContainerRef } from '@angular/core';
import { debounceTime, firstValueFrom, Subject } from 'rxjs';
import { Category } from 'src/app/structures/general.structure';
import { OptionComponent } from './option/option.component';
import { Dialog } from '@angular/cdk/dialog'
import { EditMenuComponent } from '../edit-menu/edit-menu.component';
import { DataProvider } from 'src/app/provider/data-provider.service';
import { DatabaseService } from 'src/app/services/database.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { StockListComponent } from './stock-list/stock-list.component';
declare var Hammer:any;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit,AfterViewInit {
  closeStockListPanelSubscription:Subject<boolean> = new Subject<boolean>();
  isStockListOpen = false;
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
          quantity:1,
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

  public products:any[] = []

  public categories:Category[] = []

  currentCategory:Category|undefined = undefined;
  currentEvent:any = undefined;
  stockConsumption:number = 0;
  constructor(public viewContainerRef: ViewContainerRef,private dialog:Dialog,public dataProvider:DataProvider,private databaseService:DatabaseService,private indexedDb:NgxIndexedDBService) {
    this.closeStockListPanelSubscription.pipe(debounceTime(600)).subscribe((data)=>{
      this.isStockListOpen = data;
    })
  }

  ngOnInit(): void {
    this.getDineInProducts();
  }

  ngAfterViewInit(): void {
    if (this.dataProvider.touchMode){
      // stockConsumptionTrigger recognizer
      var mc = new Hammer.Manager(document.getElementById('stockConsumptionTrigger'));
      mc.add( new Hammer.Press({ time:500 }) );
      mc.on("press", (ev:any) => {
        console.log("press",ev);
        const dialog = this.dialog.open(StockListComponent)
        dialog.componentInstance?.close.subscribe((data)=>{
          dialog.close();
        })
      });
    }
  }

  getDineInProducts() {
    this.products = []
    this.categories = []
    // this.dataProvider.pageSetting.blur = true;
    // get categories from indexedDB
    firstValueFrom(this.indexedDb.getAll('categories')).then((data:any)=>{
      // console.log("category data",data);
      if (data.length > 0){
        // console.log("category data success",data);
        this.categories = data;
      }
    }).catch((err)=>{
      // console.log("category data error",err);
    });
    if (this.dataProvider.products.length > 0){
      this.dataProvider.products.forEach((data: any) => {
        this.products.push(
          {
            ...data,
            id:data.id,
            quantity:1,
          }
        );
        this.categories.push(data.category);
      });
      // console.log("categories",this.categories);
      let filteredCat: any[] = [];
      this.categories.forEach((item, index) => {
        let found = false;
        // console.log(item)
        if (item){
          filteredCat.forEach((item2) => {
            if (item2.id == item.id) {
              found = true;
            }
          });
          if (!found) {
            filteredCat.push(item);
          }
        } else {
          // console.log("No Category",index, this.products[index].id)
        }
      });

      // console.log("filtered categories",filteredCat);
      this.categories = filteredCat;
      // map categories to products
      this.categories.forEach((category,index) => {
        category.products = [];
        this.products.forEach((product) => {
          if (product.category?.id == category.id) {
            category.products.push(product);
          }
        });
        // calculate average price
        let total = 0;
        category.products.forEach((product) => {
          total += product.price;
        })
        category.averagePrice = total / category.products.length;
      });
      // console.log("Storing categories to indexedDB");
      // store to indexedDB
      this.storeCategoriesIndexedDb()
    }
    this.dataProvider.productsLoaded.subscribe((data)=>{
      // console.log("Loaded",data);
      if (data){
        this.dataProvider.products.forEach((data: any) => {
          this.products.push(
            {
              ...data,
              id:data.id,
              quantity:1,
            }
          );
          this.categories.push(data.category);
        });
        console.log("categories",this.categories);
        let filteredCat: any[] = [];
        this.categories.forEach((item, index) => {
          let found = false;
          // console.log(item)
          if (item){
            filteredCat.forEach((item2) => {
              if (item2.name == item.name) {
                found = true;
              }
            });
            if (!found) {
              filteredCat.push(item);
            }
          } else {
            // console.log("No Category",index, this.products[index]?.id)
          }
        });
        this.categories = filteredCat;
        // map categories to products
        this.categories.forEach((category,index) => {
          category.products = [];
          this.products.forEach((product) => {
            if (product.category?.id == category.id) {
              category.products.push(product);
            }
          });
          // calculate average price
          let total = 0;
          category.products.forEach((product) => {
            total += product.price;
          })
          category.averagePrice = total / category.products.length;
        });
        // console.log("Storing categories to indexedDB");
        // store to indexedDB
       this.storeCategoriesIndexedDb()
      }
    })
  }

  storeCategoriesIndexedDb(){
    this.indexedDb.getAll('categories').subscribe((data)=>{
      if (data.length == 0){
        this.categories.forEach((category)=>{
          this.indexedDb.add('categories',category).subscribe((res)=>{
            // console.log("Category added successfully",res)
          },(err)=>{
            // console.log("Adding category ",err)
          })
        })
      } else {
        if (data.length > 0) {
          this.categories.forEach((category)=>{
            firstValueFrom(this.indexedDb.update('categories',category)).then((res)=>{
              // console.log("Category updated successfully",res)
            }).catch((err)=>{
              // console.log("Adding category ",err)
            })
          })
        }
      }
    },(err)=>{
      console.log("Serious error occured while storing categories",err)
    })
  }

  editMenu(){
    const dialog = this.dialog.open(EditMenuComponent)
  }

  openCategory(category:Category){
    if (category.products?.length > 0){
      this.dataProvider.menuProducts.next(category);
    }
  }
}
