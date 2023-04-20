import { Timestamp } from '@angular/fire/firestore';
import { DataProvider } from '../provider/data-provider.service';
import { TableConstructor, UserConstructor } from './constructors';
import { Bill } from "./Bill";
import { DatabaseService } from '../services/database.service';
import { debounceTime, Subject } from 'rxjs';


export class Table implements TableConstructor {
  id: string;
  bill: Bill | null = null;
  timeSpent:string = "";
  minutes:number = 0;
  maxOccupancy: string;
  billPrice: number;
  name: string;
  occupiedStart: Timestamp;
  status: 'available' | 'occupied';
  tableNo: number;
  type: 'table' | 'room' | 'token';
  updated: Subject<void> = new Subject<void>();
  constructor(
    id: string,
    tableNo: number,
    name: string,
    maxOccupancy: string,
    type: 'table' | 'room' | 'token',
    private dataProvider: DataProvider,
    private databaseService: DatabaseService,
  ) {
    this.id = id;
    this.occupiedStart = Timestamp.now();
    this.billPrice = 0;
    this.maxOccupancy = maxOccupancy;
    this.name = name;
    this.status = 'available';
    this.tableNo = tableNo;
    this.type = type;
    this.updated.pipe(debounceTime(1000)).subscribe(() => {
      this.databaseService.updateTable(this.toObject());
    })
  }

  removeBill() {
    this.bill = null;
    this.status = 'available';
    this.updated.next();
  }

  setBillPrice(billPrice: number) {
    this.billPrice = billPrice;
    this.updated.next();
  }

  fromObject(object: TableConstructor) {
    this.id = object.id;
    this.bill = object.bill;
    this.maxOccupancy = object.maxOccupancy;
    this.billPrice = object.billPrice;
    this.name = object.name;
    this.occupiedStart = object.occupiedStart;
    this.status = object.status;
    this.tableNo = object.tableNo;
    this.type = object.type;
  }

  toObject() {
    return {
      id: this.id,
      bill: this.bill?.id || null,
      maxOccupancy: this.maxOccupancy,
      billPrice: this.billPrice,
      name: this.name,
      occupiedStart: this.occupiedStart,
      status: this.status,
      tableNo: this.tableNo,
      type: this.type,
    };
  }

  occupyTable() {
    if (this.status === 'available') {
      if (this.dataProvider.currentUser && this.dataProvider.currentDevice) {
        let user: UserConstructor = {
          id: this.dataProvider.currentUser.userId,
          name: this.dataProvider.currentUser?.name,
          access: '',
          image: this.dataProvider.currentUser?.image,
        };
        this.bill = new Bill(
          this.dataProvider.billToken.toString(),
          this,
          'dine',
          this.dataProvider.currentDevice,
          user,
          this.dataProvider,
          this.databaseService
        );
        this.dataProvider.billToken++;
        this.databaseService.addBillToken();
        this.occupiedStart = Timestamp.now();
        this.status = 'occupied';
        this.updated.next();
        return this.bill;
      } else {
        if (!this.dataProvider.currentDevice) {
          throw new Error('No device is selected');
        } else if(!this.dataProvider.currentUser) {
          console.log("this.dataProvider.currentUser ",this.dataProvider.currentUser);
          throw new Error('No user is found');
        } else {
          throw new Error('Some error occurred');
        }
      }
    } else {
      if (this.status === 'occupied' && this.bill != undefined) {
        this.updated.next();
        return this.bill;
      } else {
        throw new Error('No bill is available on table ' + this.tableNo);
      }
    }
  }

  exchange(table:Table){
    if(this.bill && table.bill){
      let tempBill = this.bill;
      this.bill = table.bill;
      table.bill = tempBill;
      this.updated.next();
    } else {
      throw new Error("No bill is available on table " + this.tableNo + " or " + table.tableNo);
    }
  }

  merge(table:Table){
    if(this.bill && table.bill){
      this.bill.merge(table.bill);
      this.updated.next();
    } else {
      throw new Error("No bill is available on table " + this.tableNo + " or " + table.tableNo);
    }
  }
}
