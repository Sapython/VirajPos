import { Component, OnInit } from '@angular/core';
import { debounce, debounceTime, Subject } from 'rxjs';
import Fuse from 'fuse.js';
import { DataProvider } from 'src/app/provider/data-provider.service';
import { Dialog } from '@angular/cdk/dialog';
import { TableComponent } from '../table/table.component';
@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements OnInit {
  placeholders:string[] = [
    "Search any dish...",
    "Search any bill...",
    "Search any customer...",
    "Search any order...",
    "Search any payment...",
    "Search any kot...",
    "Search any table..."
  ]
  searchResults:any[] = [];
  index:number = 0;
  active:boolean = false;
  dynamicPlaceholder:string = this.placeholders[0];
  selectedMode:'dineIn'|'takeAway'|'online' = "dineIn";
  searchSubcription:Subject<string> = new Subject<string>();
  currentSearchTerm:string = "";
  searchInstance = new Fuse(this.dataProvider.products, {
    keys: ['dishName','count'],
  })
  constructor(public dataProvider:DataProvider,private dialog:Dialog) {
    // this.searchSubcription.pipe(debounceTime(800)).subscribe((value)=>{
    //   console.log(value);
    //   this.fetchAdvancedResults()
    // })
    this.searchSubcription.pipe(debounceTime(200)).subscribe((value)=>{
      console.log(value);
      this.currentSearchTerm = value;
      this.basicSearch(value)
    })
  }

  ngOnInit(): void {
    setInterval(()=>{
      this.dynamicPlaceholder = this.placeholders[this.index];
      this.index = (this.index+1)%this.placeholders.length;
    }, 2000);
  }

  basicSearch(value:string){
    this.searchInstance = new Fuse(this.dataProvider.products, {
      keys: ['dishName','count'],
    })
    let results = this.searchInstance.search(value)
    console.log("results",results);
    // {
    //   name: data.dishName,
    //   price: data.shopPrice,
    //   image: data.images[0],
    //   ingredients:[],
    //   categories: data.categories,
    //   id:doc.id,
    //   quantity:1,
    // }
    this.searchResults = results.map((result)=>{return {
      name: result.item.dishName,
      price: result.item.shopPrice,
      image: result.item.images[0],
      ingredients:[],
      categories: result.item.categories,
      id:result.item.id,
      quantity:1,
      count:result.item.count,
      ...result.item
    }})
    if (value){
      this.dataProvider.searchResults.next(this.searchResults);
    } else {
      this.dataProvider.searchResults.next(false);
    }
  }

  fetchAdvancedResults(){

  }

  selectTable(){
    const dialog = this.dialog.open(TableComponent)
  }

  switchMode(mode:any){
    console.log("mode",mode);
    this.dataProvider.billingMode = mode.value;
  }
}
