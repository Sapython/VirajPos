import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { DataProvider } from 'src/app/provider/data-provider.service';
import { AlertsAndNotificationsService } from 'src/app/services/alerts-and-notification/alerts-and-notifications.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Product, TableConstructor } from '../constructors';
import { Kot } from '../Kot';
import { Table } from "../Table";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  tables:Table[] = []
  selectedKotsForKotTransfer:Kot[] = []
  interval:any;
  moveKotMode:boolean = false;
  moveKotSelectedTable:Table|undefined;
  transferTableWise:{fromTable:Table|undefined,toTable:Table|undefined}= {fromTable:undefined,toTable:undefined};
  public editBillingMode:'dineIn'|'takeaway'|'delivery' = 'dineIn';
  constructor(public dialogRef:DialogRef,public dataProvider:DataProvider,private database:DatabaseService,private alertify:AlertsAndNotificationsService){}
  ngOnInit(): void {
    console.log("this.dataProvider.tables ",this.dataProvider.tables);
    this.tables = this.dataProvider.tables;
    if(this.interval){clearInterval(this.interval)}
    this.interval = setInterval(()=>{
      this.dataProvider.tables.forEach((table)=>{
        if (table.status== 'occupied' && table.occupiedStart){
          table.timeSpent = this.getTime(table.occupiedStart)
          table.minutes = Number(table.timeSpent.split(':')[0])
        }
      })
    },500)
    this.dataProvider.tables.sort((a,b)=>{
      return a.tableNo - b.tableNo;
    })
    // this.dataProvider.tables.forEach((table)=>{
    //   this.tables.push(new Table(table.id,table.tableNo,table.name,table.maxOccupancy,table.type,this.dataProvider))
    // })
  }

  getTime(date:Timestamp){
    let milliseconds =(new Date()).getTime() - (date.toDate().getTime());
    // convert milliseconds to minutes and seconds
    let minutes = Math.floor(milliseconds / 60000);
    let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
  }

  printTable(table:Table,event:any){
    event.stopPropagate()
  }

  openTable(table:Table,event:any){
    this.dialogRef.close(table)
    event.stopPropagation()
    this.dataProvider.currentBill = table.occupyTable()
    this.dataProvider.currentTable = table;
    this.dataProvider.billAssigned.next();
  }

  addToken(){
    // add a table
    let table = new Table((this.dataProvider.tokens.length+1).toString(),(this.dataProvider.tokens.length+1),(this.dataProvider.tokens.length+1).toString(),'1','token',this.dataProvider,this.database)
    this.dataProvider.tokens.push(table)  
  }

  moveKot(table:Table,event:any){
    this.moveKotSelectedTable = table;
    console.log("this.moveKotSelectedTable ",this.moveKotSelectedTable,event);
  }

  exchange(){
    if(this.transferTableWise.fromTable && this.transferTableWise.toTable){
      try{
        this.transferTableWise.fromTable.exchange(this.transferTableWise.toTable)
        this.alertify.presentToast("Table exchanged successfully")
        // reset vars and switch mode
        this.transferTableWise = {fromTable:undefined,toTable:undefined}
        this.moveKotMode = false;
        this.moveKotSelectedTable = undefined;
      } catch (error:any) {
        this.alertify.presentToast(error)
      }
    }
  }

  merge(){
    if(this.transferTableWise.fromTable && this.transferTableWise.toTable){
      try{
        this.transferTableWise.fromTable.merge(this.transferTableWise.toTable)
        this.alertify.presentToast("Table merged successfully")
        // reset vars and switch mode
        this.transferTableWise = {fromTable:undefined,toTable:undefined}
        this.moveKotMode = false;
        this.moveKotSelectedTable = undefined;
      } catch (error:any) {
        this.alertify.presentToast(error)
      }
    }
  }

  cancel(){
    this.transferTableWise = {fromTable:undefined,toTable:undefined}
    this.moveKotMode = false;
    this.moveKotSelectedTable = undefined;
  }

  changeTable(event:any,kot:Kot){
    // add kot to selectedKotsForKotTransfer
    console.log("event ",event);
    if(event.checked){
      this.selectedKotsForKotTransfer.push(kot)
    } else {
      this.selectedKotsForKotTransfer = this.selectedKotsForKotTransfer.filter((k)=>{
        return k.id != kot.id
      })
    }
  }

  moveSelectedKots(table:Table,event:any){
    if(!table.bill){
      throw new Error("Bill not found")
    }
    // get all selected productcs from selected kots from moveKotSelectedTable?.bill?.kots
    let kots:Kot[] = []
    let products:Product[] = []
    this.moveKotSelectedTable?.bill?.kots.forEach((kot)=>{
      if (kot.allSelected){
        kots.push(kot)
        console.log("Adding kot ",kot.products);
      } else {
        products.push(...kot.products.filter((p)=>p.selected))
        console.log("Adding products ",...kot.products.filter((p)=>p.selected));
      }
    })
    console.log("kots ",kots);
    console.log("products ",products);
    // now shift the kots to the new table and add products to a new kot
    if (kots.length>0){
      kots.forEach((kot)=>{
        table.bill!.kots.push(kot)
        table.bill!.tokens.push(kot.id)
        // remove kot from old table
        this.moveKotSelectedTable!.bill!.kots = this.moveKotSelectedTable!.bill!.kots.filter((k)=>{
          return k.id != kot.id
        })
      })
    }
    if (products.length>0){
      products.forEach((product)=>{
        table.bill!.addProduct({...product,transferred:this.moveKotSelectedTable?.id})
      })
      // remove products from old table
      this.moveKotSelectedTable!.bill!.kots.forEach((kot)=>{
        kot.products = kot.products.filter((p)=>{
          return !p.selected
        })
      })
    }
    this.moveKotSelectedTable!.bill?.calculateBill()
    table.bill?.calculateBill()
  }
}
