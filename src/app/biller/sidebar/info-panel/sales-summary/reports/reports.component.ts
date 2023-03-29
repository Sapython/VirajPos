import { Component, OnInit } from '@angular/core';
import { BillConstructor, KotConstructor, TableConstructor } from 'src/app/biller/constructors';
import { DatabaseService } from 'src/app/services/database.service';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  constructor(private databaseService: DatabaseService) {}
  bills:BillConstructor[] = []
  ncBills:BillConstructor[] = []
  tables:TableConstructor[] = []
  ngOnInit(): void {
    this.databaseService.getTables().then((tables) => {
      this.tables = tables.docs.map((doc) => {
        return {...doc.data(),id:doc.id} as TableConstructor;
      })
      this.databaseService.getBills().then((bills) => {
        let allBills = bills.docs.map((doc) => {
          return {...doc.data(),id:doc.id,table:this.tables.find((res)=>res.id == doc.data()["table"])} as BillConstructor;
        })
        this.bills = allBills.filter((res)=>!res.nonChargeableDetail)
        this.ncBills = allBills.filter((res)=>res.nonChargeableDetail)
      });
    })
  }

  joinArray(bill:KotConstructor[]){
    // join to form a string of ids with comma
    return bill.map((res)=>res.id).join(',')
  }

  export(){
    const doc = new jsPDF()
    autoTable(doc, { html: '#my-table' })

  }
}
