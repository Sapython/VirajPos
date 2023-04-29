import { Injectable } from '@angular/core';
import { DataProvider } from '../provider/data-provider.service';
import { Product, Tax } from '../biller/constructors';
import { Table } from 'jspdf-autotable';
import { Bill } from '../biller/Bill';
import { Discount } from '../biller/settings/settings.component';
declare var window:any;
@Injectable({
  providedIn: 'root'
})
export class PrintingService {

  constructor(private dataprovider:DataProvider) { }

  getPrinters(){
    return window.pywebview.api.getPrinters();
  }

  printKot(tableNo:string,billNo:string,products:Product[],id:string){
    let businessDetails = {
      'name': this.dataprovider.currentBusiness?.hotelName,
      'address': this.dataprovider.currentBusiness?.address,
      'phone': this.dataprovider.currentBusiness?.phone,
      "gst": this.dataprovider.currentBusiness?.gst,
      "fssai": this.dataprovider.currentBusiness?.fssai,
    }
    let printerConfig = this.dataprovider.currentMenu?.products.map((product:any)=>{
      return {product:product.id,printer:product.category.printer}
    })
    let data ={
      'id':id,
      'businessDetails': businessDetails,
      "table": tableNo,
      'billNo': billNo,
      "date":(new Date()).toLocaleDateString(),
      "time":(new Date()).toLocaleTimeString(),
      "mode":"firstChargeable",
      "products":products.map((product:Product)=>{
        return {
          "id":product.id,
          "name":product.name,
          "instruction":product.instruction,
          "quantity":product.quantity,
          "price":product.price,
          "total":product.price*product.quantity,
        }
      })
    }
    console.log("printing data",data,printerConfig);
    return window.pywebview.api.print(data['mode'],data,printerConfig);
  }

  printBill(bill:Bill){
    alert("Printing bill")
    let businessDetails = {
      'name': this.dataprovider.currentBusiness?.hotelName,
      'address': this.dataprovider.currentBusiness?.address,
      'phone': this.dataprovider.currentBusiness?.phone,
      "gst": this.dataprovider.currentBusiness?.gst,
      "fssai": this.dataprovider.currentBusiness?.fssai,
    }
    let printerConfig = this.dataprovider.currentMenu?.products.map((product:any)=>{
      return {product:product.id,printer:product.category.printer}
    })
    let billdata = {
      "id": bill.id,
      "products":bill.allProducts.map((product:Product)=>{
        return {
          "id":product.id,
          "name":product.name,
          "instruction":product.instruction,
          "quantity":product.quantity,
          "price":product.price,
          "total":product.price*product.quantity,
        }
      }),
      "date":(new Date()).toLocaleDateString(),
      "time":(new Date()).toLocaleTimeString(),
      "grandTotal":bill.billing.grandTotal,
      "tax": bill.billing.taxes.map((tax:Tax)=>{
        return {
          "name": tax.name,
          "value": tax.amount,
          "rate": tax.value,
        }
      }),
      "totaltax":{
          "value": bill.billing.totalTax,
          "rate":bill.billing.taxes.reduce((a,b:Tax)=>a+b.value,0)
      },
      "discount": bill.billing.discount.map((discount:Discount)=>{
        return {
          "name": discount.name,
          "value": discount.totalAppliedDiscount,
          "rate": discount.value,
          "type": discount.type,
        }
      }),
      "subtotal":bill.billing.subTotal,
      "totalQuantity":bill.totalProducts(),
      "cashierName": this.dataprovider.currentUser?.name,
      "mode":"bill",
      "table": 1,
      'billNo': 1,
      'notes':[],
      'businessDetails': businessDetails
    }
    alert("Ready to print")
    console.log("printing data",billdata,printerConfig);
    return window.pywebview.api.print(billdata['mode'],billdata,printerConfig);
  }

}
