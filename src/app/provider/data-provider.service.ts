import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { TableConstructor } from '../biller/constructors';
import { Bill } from "../biller/Bill";
import { Device } from "../biller/Device";
import { Table } from "../biller/Table";
import { Category } from '../structures/general.structure';
import { UserRecord } from '../structures/user.structure';

@Injectable({
  providedIn: 'root'
})
export class DataProvider {
  constructor() {
    // read viewSettings from localStorage every 2 seconds
    setInterval(() => {
      this.smartMode = (localStorage.getItem('viewSettings')?JSON.parse(localStorage.getItem('viewSettings')!):{smartView:false}).smartView;
    } , 2000);
    window.addEventListener('resize', () => {
      this.clientWidth = window.innerWidth;
      this.clientHeight = window.innerHeight;
    })
  }

  // smart vars
  public chatInnerHtml:Node|undefined;
  public chatCustomWidget:any;

  // constants
  public password:string = '123456';

  // counters
  public sale:number = 12345;
  public billToken:number = 500;
  public kotToken:number = 500;

  // public access
  public products:any[] = [];
  public currentUser:UserRecord|undefined;
  public currentFirebaseUser:User|undefined;
  public tables:Table[] = [];
  public tokens:Table[] = [];
  
  // statuses
  public billingMode:'dineIn'|'takeaway'|'delivery' = 'dineIn';
  public isAuthStateAvaliable:boolean =false;
  public loggedIn:boolean = false;
  public currentTable:Table|undefined;
  public currentBuisness:number = 0;
  public currentDevice:Device|undefined;
  public currentBill:Bill|undefined;
  public moreActions:boolean = false;
  public manageKot:boolean = false;
  public totalSales:number = 0;
  public clientWidth:number = window.innerWidth;
  public clientHeight:number = window.innerHeight;
  public smartMode:boolean = (localStorage.getItem('viewSettings')?JSON.parse(localStorage.getItem('viewSettings')!):{smartView:false}).smartView;
  public touchMode:boolean = (localStorage.getItem('viewSettings')?JSON.parse(localStorage.getItem('viewSettings')!):{touchMode:false}).touchMode;
  
  // triggers
  public closeAllPanel:Subject<boolean> = new Subject<boolean>();
  public menuProducts:Subject<Category> = new Subject<Category>();
  public currentAuthState:Subject<User> = new Subject<User>();
  public selectProduct:Subject<any> = new Subject<any>();
  public selectTable:Subject<Table> = new Subject<Table>();
  public openTableView:Subject<boolean> = new Subject<boolean>();
  public billAssigned:Subject<void> = new Subject<void>();
  public searchResults:Subject<any[]|false> = new Subject<any[]|false>();
  public productsLoaded:Subject<boolean> = new Subject<boolean>();
  public billUpdated:Subject<void> = new Subject<void>();

}
