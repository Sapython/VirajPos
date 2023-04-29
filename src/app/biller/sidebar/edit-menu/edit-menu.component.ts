import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Subject, debounceTime, firstValueFrom } from 'rxjs';
import { DataProvider } from 'src/app/provider/data-provider.service';
import { Category, RootCategory } from 'src/app/structures/general.structure';
import { AddDishComponent } from './add-dish/add-dish.component';
import { AddNewCategoryComponent } from './add-new-category/add-new-category.component';
import { SelectRecipeComponent } from './select-recipe/select-recipe.component';
import { Product } from '../../constructors';
import { DatabaseService, Menu } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/alerts-and-notification/alerts-and-notifications.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductCostingComponent } from './product-costing/product-costing.component';
import Fuse from 'fuse.js';
import { AddMenuComponent } from './add-menu/add-menu.component';
import { PrintingService } from 'src/app/services/printing.service';
@Component({
  selector: 'app-edit-menu',
  templateUrl: './edit-menu.component.html',
  styleUrls: ['./edit-menu.component.scss']
})
export class EditMenuComponent implements OnInit {
  public recommended:Category[] = []
  printers:string[] = [];
  // allProducts:Category = {
  //   name: "All Products",
  //   id: "all",
  //   products: [],
  //   averagePrice: 0,
  //   enabled:true
  // }
  // mode:'allProducts'|'single' = 'allProducts';
  // categoryUpdated:boolean = false;
  // public categories:Category[] = []
  // selectedCategory:Category|undefined;
  // maxPrice = 1000;
  // productVisibilityChanged:boolean = false;
  // rootCategories:Category[] = []
  // viewCategories:Category[] = []
  // recommendedCategories:Category[] = []
  // fuseInstance:Fuse<Product> = new Fuse([],{keys:['name']});
  // searchSubject:Subject<string> = new Subject<string>();
  // filteredProducts:Product[] = [];
  // dineInSelectedMenu:Menu|undefined;
  // dineInSelectedMenuUpdated:boolean = false;
  // takeawaySelectedMenu:Menu|undefined;
  // takeawaySelectedMenuUpdated:boolean = false;
  // onlineSelectedMenu:Menu|undefined;
  // onlineSelectedMenuUpdated:boolean = false;
  // menus:Menu[] = [];

  // modeConfigs:ModeConfig[] = []

  currentType:'recommended'|'root'|'view'|'all' = 'all';
  constructor(private dialog:Dialog,public dataProvider:DataProvider,private databaseService:DatabaseService,private alertify:AlertsAndNotificationsService,private dialogRef:DialogRef,private printingService:PrintingService){
    // this.searchSubject.pipe(debounceTime(500)).subscribe((searchString)=>{
    //   if (searchString){
    //     let res = this.fuseInstance.search(searchString);
    //     this.filteredProducts = res.map((result)=>result.item)
    //   } else {
    //     this.filteredProducts = [];
    //   }
    // })
    this.dialogRef.closed.subscribe(()=>{
      this.dataProvider.loading = true;
      Promise.all(this.dataProvider.menus.map((menu)=>{
        return menu.updateChanged()
      })).then((r)=>{
        console.log(r);
        this.alertify.presentToast("Menu changes updated successfully")
      }).catch((c)=>{
        console.log(c);
        this.alertify.presentToast("Error updating menu")
      }).finally(()=>{
        this.dataProvider.loading = false;
      })
    })
  }

  async ngOnInit(): Promise<void> {
    try{
      this.printers = await this.printingService.getPrinters()
      if (this.printers.length == 0){
        this.printers.push("Basic Printer")
      }
    } catch (e){
      this.printers = ["Basic Printer"]
    }
  }

  // addNewCategory(){
  //   const dialog = this.dialog.open(AddNewCategoryComponent, {data:{products:this.allProducts.products}})
  // }

  addNewMenu(){
    const dialog = this.dialog.open(AddMenuComponent)
    dialog.closed.subscribe((data:any)=>{
      console.log("data",data);
      if(data){

        // this.databaseService.addNewMenu(data.menu,data.products).then((data:any)=>{

        // })
      }
    })
  }

}
export class ModeConfig {
  name:string;
  active:boolean;
  selectedMenuId:string = "";
  selectedMenu:Menu|undefined = this.dataProvider.allMenus.find((menu)=>menu.id == this.selectedMenuId);
  filteredProducts:Product[];
  productVisibilityChanged:boolean = false;
  allProductsCategory:Category;
  products:Product[] = [];
  recommendedCategories:Category[] = [];
  viewCategories:Category[] =[];
  mainCategories:Category[] = [];
  categoryUpdated:boolean;
  currentType:'recommended'|'root'|'view'|'all';
  selectedCategory:Category|undefined;
  type:'dineIn'|'takeaway'|'online'|undefined;
  searchSubject:Subject<string> = new Subject<string>();
  fuseInstance:Fuse<Product> = new Fuse([],{keys:['name']});
  highCostForm:FormGroup = new FormGroup({
    min:new FormControl(this.dataProvider.highCostConfig,[Validators.required]),
    max:new FormControl()
  });
  lowCostForm:FormGroup = new FormGroup({
    min:new FormControl(this.dataProvider.lowCostConfig,[Validators.required]),
    max:new FormControl()
  })
  highRangeForm:FormGroup = new FormGroup({
    min:new FormControl(this.dataProvider.highRangeConfig,[Validators.required]),
    max:new FormControl()
  })
  lowRangeForm:FormGroup = new FormGroup({
    min:new FormControl(this.dataProvider.lowRangeConfig,[Validators.required]),
    max:new FormControl()
  })
  mostSellingForm:FormGroup = new FormGroup({
    min:new FormControl(this.dataProvider.mostSellingConfig,[Validators.required]),
    max:new FormControl()
  })
  newDishesForm:FormGroup = new FormGroup({
    min:new FormControl(this.dataProvider.newDishesConfig,[Validators.required]),
    max:new FormControl()
  })
  constructor(name:string,type:'dineIn'|'takeaway'|'online',selectedMenu:Menu|undefined,selectedMenuId:string,private dataProvider:DataProvider,private databaseService:DatabaseService,private alertify:AlertsAndNotificationsService,private dialog:Dialog){
    this.name = name;
    this.type = type;
    this.active = this.isActive;
    this.filteredProducts = [];
    this.selectedMenuId = selectedMenuId;
    this.selectedMenu = selectedMenu;
    this.categoryUpdated = false;
    this.currentType = 'all';
    this.allProductsCategory = {
      enabled:true,
      id:'allProducts',
      name:'All Products',
      products:this.products,
      averagePrice:0,
    }
    this.selectedCategory = this.allProductsCategory;
    if (this.selectedMenu){
      this.getAllData()
    }
    this.searchSubject.pipe(debounceTime(500)).subscribe((searchString)=>{
      if (searchString){
        let res = this.fuseInstance.search(searchString);
        this.filteredProducts = res.map((result)=>result.item)
      } else {
        this.filteredProducts = [];
      }
    })
  }


  get isActive() {
    if (this.type == 'dineIn'){
      return this.dataProvider.activeModes[0]
    } else if (this.type == 'takeaway'){
      return this.dataProvider.activeModes[1]
    } else if (this.type == 'online'){
      return this.dataProvider.activeModes[2]
    } else {
      return false;
    }
  };

  async getProducts(){
    if(this.selectedMenu){
      let data = await this.databaseService.getProductsByMenu(this.selectedMenu);
      this.products = data.docs.map((doc)=>{return {...doc.data(),id:doc.id} as Product});
      this.fuseInstance.setCollection(this.products);
      this.selectedCategory = this.allProductsCategory;
    }
  }

  async getRecommendedCategories(){
    if(this.selectedMenu){
      let data = await this.databaseService.getRecommendedCategoriesByMenu(this.selectedMenu)
      this.recommendedCategories = data.docs.map((doc)=>{
        return {
          ...doc.data(),
          name:doc.data()['name'],
          id:doc.id,
          products: this.products.filter((p)=>{return doc.data()['products'].includes(p.id)})
        } as Category
      });
    }
  }

  async getViewCategories(){
    if(this.selectedMenu){
      let data = await this.databaseService.getViewCategoriesByMenu(this.selectedMenu)
      this.viewCategories = data.docs.map((doc)=>{
        return {
          ...doc.data(),
          name:doc.data()['name'],
          id:doc.id,
          products: this.products.filter((p)=>{return doc.data()['products'].includes(p.id)})
        } as Category
      });
    }
  }

  async getMainCategories(){
    if(this.selectedMenu){
      let data = await this.databaseService.getMainCategoriesByMenu(this.selectedMenu)
      this.mainCategories = data.docs.map((doc)=>{
        return {
          ...doc.data(),
          name:doc.data()['name'],
          id:doc.id,
          products: this.products.filter((p)=>{return doc.id == p.category.id}),
        } as Category
      })
    }
  }

  async getAllData(){
    await this.getProducts();
    await this.getMainCategories();
    await this.getRecommendedCategories();
    await this.getViewCategories();
    this.dataProvider.menuLoadSubject.next({
      type:this.type,
    });
  }

  updateMenu(){
    this.selectedMenu = this.dataProvider.allMenus.find((menu)=>menu.id == this.selectedMenuId);
    console.log("updating menu",this.selectedMenu,this.type);
    if(this.selectedMenu && this.type){
      this.databaseService.updateMenu(this.selectedMenu,this.type).then(async (data)=>{
        await this.getAllData();
        this.alertify.presentToast("Menu Fetched Successfully");
      }).catch((err)=>{
        this.alertify.presentToast("Menu Update Failed");
      })
    } else {
      this.alertify.presentToast("No Valid Menu Selected");
    }
  };
  selectCategory(cat:Category){
    this.selectedCategory = cat;
    this.categoryUpdated = false;
    this.fuseInstance.setCollection(this.selectedCategory.products);
  };
  addViewCategory(){
    const dialog = this.dialog.open(AddNewCategoryComponent, {data:{products:this.products}})
  };
  disableAll(){
    if(this.selectedCategory){
      this.selectedCategory.products.forEach((product)=>{
        product.visible = false;
        product.updated = true;
      })
      this.productVisibilityChanged = true;
    } else {
      this.alertify.presentToast("No Valid Category")
    }
  };
  enableAll(){
    if(this.selectedCategory){
      this.selectedCategory.products.forEach((product)=>{
        product.visible = true;
        product.updated = true;
      })
      this.productVisibilityChanged = true;
    } else {
      this.alertify.presentToast("No Valid Category")
    }
  };
  recommendationSave(id:string){
    if (this.selectedMenu){
      if (id=='highRange'){
        if (this.highRangeForm.value.min && this.highRangeForm.value.max){
          var filteredList = this.products.filter(product => product.price >= this.highRangeForm.value.min && product.price <= this.highRangeForm.value.max);
        } else if (this.highRangeForm.value.min){
          var filteredList = this.products.filter(product => product.price >= this.highRangeForm.value.min);
        } else if (this.highRangeForm.value.max){
          var filteredList = this.products.filter(product => product.price <= this.highRangeForm.value.max);
        } else {
          var filteredList = this.products;
        }
        this.databaseService.setSettingsMenu(this.highRangeForm.value,'highRange',filteredList.map((p) => p.id),this.selectedMenu).then((data:any)=>{
          this.alertify.presentToast("Settings Updated Successfully");
        }).catch((err)=>{
          this.alertify.presentToast("Settings Update Failed");
        })
      } else if (id=='lowRange'){
        if (this.lowRangeForm.value.min && this.lowRangeForm.value.max){
          var filteredList = this.products.filter(product => product.price >= this.lowRangeForm.value.min && product.price <= this.lowRangeForm.value.max);
        } else if (this.lowRangeForm.value.min){
          var filteredList = this.products.filter(product => product.price >= this.lowRangeForm.value.min);
        } else if (this.lowRangeForm.value.max){
          var filteredList = this.products.filter(product => product.price <= this.lowRangeForm.value.max);
        } else {
          var filteredList = this.products;
        }
        this.databaseService.setSettingsMenu(this.lowRangeForm.value,'lowRange',filteredList.map((p) => p.id),this.selectedMenu).then((data:any)=>{
          this.alertify.presentToast("Settings Updated Successfully");
        }).catch((err)=>{
          this.alertify.presentToast("Settings Update Failed");
        })
      } else if (id=='mostSelling'){
        // var filteredList = this.products.filter(product => (product.sales || 0) >= this.mostSellingForm.value.min && (product.sales || 0) <= this.mostSellingForm.value.max);
        if (this.mostSellingForm.value.min && this.mostSellingForm.value.max){
          var filteredList = this.products.filter(product => (product.sales || 0) >= this.mostSellingForm.value.min && (product.sales || 0) <= this.mostSellingForm.value.max);
        } else if (this.mostSellingForm.value.min){
          var filteredList = this.products.filter(product => (product.sales || 0) >= this.mostSellingForm.value.min);
        } else if (this.mostSellingForm.value.max){
          var filteredList = this.products.filter(product => (product.sales || 0) <= this.mostSellingForm.value.max);
        } else {
          var filteredList = this.products;
        }
        this.databaseService.setSettingsMenu(this.mostSellingForm.value,'mostSelling',filteredList.map((p) => p.id),this.selectedMenu).then((data:any)=>{
          this.alertify.presentToast("Settings Updated Successfully");
        }).catch((err)=>{
          this.alertify.presentToast("Settings Update Failed");
        })
      } else if (id=='newDishes'){
        // var filteredList = this.products.filter(product => product.createdDate.toDate().getTime() >= this.newDishesForm.value.min.getTime() && product.createdDate.toDate().getTime() <= this.newDishesForm.value.max.getTime());
        if (this.newDishesForm.value.min && this.newDishesForm.value.max){
          var filteredList = this.products.filter(product => product.createdDate.toDate().getTime() >= this.newDishesForm.value.min.getTime() && product.createdDate.toDate().getTime() <= this.newDishesForm.value.max.getTime());
        } else if (this.newDishesForm.value.min){
          var filteredList = this.products.filter(product => product.createdDate.toDate().getTime() >= this.newDishesForm.value.min.getTime());
        } else if (this.newDishesForm.value.max){
          var filteredList = this.products.filter(product => product.createdDate.toDate().getTime() <= this.newDishesForm.value.max.getTime());
        } else {
          var filteredList = this.products;
        }
        this.databaseService.setSettingsMenu(this.newDishesForm.value,'newDishes',filteredList.map((p) => p.id),this.selectedMenu).then((data:any)=>{
          this.alertify.presentToast("Settings Updated Successfully");
        }).catch((err)=>{
          this.alertify.presentToast("Settings Update Failed");
        })
      }
    } else {
      this.alertify.presentToast("Please Select Menu");
    }
  };
  addRecipe(){
    this.dialog.open(AddDishComponent, {})
  };
  selectRecipe(){
    const dialog = this.dialog.open(SelectRecipeComponent, {data:this.products})
    dialog.closed.subscribe((data:any)=>{
      console.log("data",data);
      if(data){
        if (this.selectedCategory){
          const ids:string[] = data.filter((d:Product) => d.selected).map((product:Product)=> product.id)
          console.log("business/UTJetLFyQnfthZssQoEh/viewCategories",this.selectedCategory.id,ids);
          this.databaseService.updateViewCategory(this.selectedCategory.id,ids).then((data:any)=>{
            this.alertify.presentToast("Category Updated Successfully");
          }).catch((err)=>{
            this.alertify.presentToast("Category Update Failed");
          })
          this.selectedCategory.products.push(...data.filter((product:Product)=> product.selected));
        }
      }
    })
  };

  updatePrinter(selectedCategory:Category){
    console.log("selectedCategory",selectedCategory);
    if(this.selectedMenu){
      this.databaseService.setPrinter(this.selectedMenu,selectedCategory)
    } else {
      this.alertify.presentToast("Please Select Menu")
    }
  }

  updateChanged(){
    this.dataProvider.menus.forEach((menu:ModeConfig) => {
      console.log("menu",menu.selectedMenu);
    })
    this.selectedMenu = this.dataProvider.allMenus.find((menu:Menu) => {
      console.log(menu.id, this.selectedMenuId,menu.id == this.selectedMenuId);
      return menu.id == this.selectedMenuId
    });
    console.log("selectedMenu",this.selectedMenu);
    if(this.selectedMenu){
      let updatableProducts = this.products.filter((product:Product) => product.updated);
      let updatablerecommendedCategories = this.recommendedCategories.filter((category:Category) => category.updated);
      let updatableviewCategories = this.viewCategories.filter((category:Category) => category.updated);
      let updatablemainCategories = this.mainCategories.filter((category:Category) => category.updated);
      let updateRequestProducts = updatableProducts.map((product:Product) => this.databaseService.updateProductMenu({...product,updated:false},this.selectedMenu!));
      let updateRequestrecommendedCategories = updatablerecommendedCategories.map((category:Category) => this.databaseService.updateRecommendedCategoryMenu({...category,products:category.products.map((p)=>p.id),updated:false},this.selectedMenu!));
      let updateRequestviewCategories = updatableviewCategories.map((category:Category) => this.databaseService.updateViewCategoryMenu({...category,products:category.products.map((p)=>p.id),updated:false},this.selectedMenu!));
      let updateRequestmainCategories = updatablemainCategories.map((category:Category) => this.databaseService.updateMainCategoryMenu({...category,products:category.products.map((p)=>p.id),updated:false},this.selectedMenu!));
      return Promise.all([updateRequestProducts,updateRequestmainCategories,updateRequestrecommendedCategories,updateRequestviewCategories].flat())
    } else {
      return Promise.reject("Please Select Menu");
    }
  }

  getExcelFormat(){

  };
  openProductCosting(product:Product){
    this.dialog.open(ProductCostingComponent,{data:product})
  };
}