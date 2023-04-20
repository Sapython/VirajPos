import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs } from '@firebase/firestore';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { TableConstructor } from '../biller/constructors';
import { Table } from "../biller/Table";
import { DataProvider } from '../provider/data-provider.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  constructor(private dataProvider:DataProvider,private firestore:Firestore,private dbService:NgxIndexedDBService,private databaseService:DatabaseService) {
    dbService.getAll('tables').subscribe((res:any)=>{
      if (res.length > 0){
        this.dataProvider.tables = res;
      }
      console.log("res.tables ",res);
    },(err)=>{
      console.log("Error ",err);
    })
    this.getTables();
  }

  async getTables(){
    getDocs(collection(this.firestore,'business/UTJetLFyQnfthZssQoEh/tables')).then((res)=>{
      if (res.docs.length > 0){
        this.dataProvider.tables = res.docs.map((doc)=>{
          let table =  {...doc.data(),id:doc.id} as TableConstructor
          let tableClass = new Table(table.id,Number(table.tableNo),table.name,table.maxOccupancy,table.type,this.dataProvider,this.databaseService)
          tableClass.fromObject(table);
          return tableClass;
        })
        console.log("tables ",this.dataProvider.tables);
        // add data to indexedDB
        this.dataProvider.tables.forEach((table)=>{
          this.dbService.getAll('tables').subscribe((res)=>{
            if (res.length >0 ){
              this.dbService.update('tables',table.toObject()).subscribe((res)=>{
                console.log("adding table res ",res);
              },(err)=>{
                console.log("adding table Error ",err);
              })
            } else {
              this.dbService.add('tables',table.toObject()).subscribe((res)=>{
                console.log("adding table res ",res);
              },(err)=>{
                console.log("adding table Error ",err);
              })
            }
          })
        })
        // sort tables by tableNo
        this.dataProvider.tables.sort((a,b)=>{
          return a.tableNo - b.tableNo;
        })
      } else {
        if (this.dataProvider.tables.length == 0 && res.docs.length == 0){
          this.dataProvider.tables = [];
        }
      }
    }).catch((err)=>{
      console.log("Table fetch Error ",err);
    })
  }
}
