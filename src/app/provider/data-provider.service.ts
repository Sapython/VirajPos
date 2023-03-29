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
  constructor() { }

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
