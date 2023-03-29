import { Timestamp } from '@angular/fire/firestore';
import { Device } from './Device';
import { Table } from './Table';
import { User } from './User';
import {
  BillConstructor,
  CustomerInfo,
  Billing,
  Product,
  Discount,
  Tax,
} from './constructors';
import { debounceTime, Subject } from 'rxjs';
import { DataProvider } from '../provider/data-provider.service';
import { DatabaseService } from '../services/database.service';
import { Print, PrintConstructor } from './Print';
import { Kot } from './Kot';
const taxes:Tax[] = [
  {
    id: 'tax1',
    name: 'SGST',
    type: 'percentage',
    value: 2.5,
    amount:0
  },
  {
    id: 'tax1',
    name: 'CGST',
    type: 'percentage',
    value: 2.5,
    amount:0
  },
]
export class Bill implements BillConstructor {
  id: string;
  tokens: string[] = [];
  createdDate: Timestamp;
  stage: 'active' | 'finalized' | 'settled' | 'cancelled';
  customerInfo: CustomerInfo;
  device: Device;
  mode: 'dine' | 'takeaway' | 'online';
  kots: Kot[] = [];
  table: Table;
  printer:PrintConstructor = new Print()
  billing: Billing;
  instruction: string;
  editKotMode: null | {
    previousKot: Product[];
    newKot: Product[];
    kot: Kot;
    kotIndex: number;
  } = null;
  user: User;
  nonChargeableDetail?: {
    reason: string;
    time: Timestamp;
    user: User;
    phone: string;
    name: string;
  };
  billingMode: 'cash' | 'card' | 'upi' | 'nonChargeable' = 'cash';
  settlement?: {
    customerName: string;
    customerContact: string;
    paymentMethod: string;
    cardEnding?: string;
    upiAddress?: string;
    time: Timestamp;
    user: User;
  } = undefined;
  cancelledReason?: {
    reason: string;
    time: Timestamp;
    phone: string;
    user: User;
  };
  updated: Subject<void> = new Subject<void>();
  currentKot: Kot | undefined = this.kots.find((kot) => kot.stage === 'active');
  get kotWithoutFunctions(): any[]{
    return this.kots.map((kot) => kot.toObject());
  }
  constructor(
    id: string,
    table: Table,
    mode: 'dine' | 'takeaway' | 'online',
    device: Device,
    billerUser: User,
    private dataProvider: DataProvider,
    private databaseService: DatabaseService
  ) {
    this.updated.pipe(debounceTime(10000)).subscribe(() => {
      let data = this.toObject();
      console.log('updating bill', data);
      this.databaseService.updateBill(data);
      console.log('Bill updated', data);
    });
    this.toObject = this.toObject.bind(this);
    this.id = id;
    this.instruction = ""
    this.createdDate = Timestamp.now();
    this.stage = 'active';
    this.mode = mode;
    this.customerInfo = {};
    this.device = device;
    this.table = table;
    this.user = billerUser;
    this.billing = {
      subTotal: 0,
      discount: [],
      taxes: [],
      totalTax:0,
      grandTotal: 0,
    };
    this.updated.next();
  }

  addKot(kot: Kot) {
    this.kots.push(kot);
    this.tokens.push(this.dataProvider.kotToken.toString());
    this.dataProvider.kotToken++;
    this.billing.subTotal = this.kots.reduce((acc, cur) => {
      return (
        acc +
        cur.products.reduce((acc, cur) => {
          return acc + cur.price * cur.quantity;
        }, 0)
      );
    }, 0);
    this.billing.grandTotal = this.billing.subTotal;
    this.updated.next();
  }

  clearAllKots() {
    this.kots = [];
    this.billing.subTotal = 0;
    this.billing.grandTotal = 0;
    this.updated.next();
  }

  addProduct(product: Product) {
    // if (this.stage !== 'active') {
    //   alert('This bill is already finalized.');
    //   return;
    // }
    // const kotIndex = this.kots.findIndex((kot) => kot.stage === 'active');
    // if (kotIndex === -1) {
    //   let kot = new Kot(this.dataProvider.kotToken.toString(),product)
    //   // this.kots.push({
    //   //   id: this.dataProvider.kotToken.toString(),
    //   //   createdDate: Timestamp.now(),
    //   //   products: [product],
    //   //   stage: 'active',
    //   //   selected: false,
    //   //   allSelected: false,
    //   //   editMode: false,
    //   //   someSelected: false,
    //     // selectAll: function (event: any) {
    //     //   const value = event.checked;
    //     //   this.products.forEach((item) => (item.selected = value));
    //     // },
    //     // checkAll: function () {
    //     //   this.allSelected = this.products.every((item) => item.selected);
    //     //   this.someSelected =
    //     //     this.products.some((item) => item.selected) && !this.allSelected;
    //     // },
    //     // toObject: function () {
    //     //   return {
    //     //     id: this.id,
    //     //     createdDate: this.createdDate,
    //     //     products: this.products,
    //     //     stage: this.stage,
    //     //     selected: this.selected,
    //     //     allSelected: this.allSelected,
    //     //     editMode: this.editMode,
    //     //     someSelected: this.someSelected,
    //     //   };
    //     // },
    //   // });
    //   this.kots.push(kot)
    //   this.dataProvider.kotToken++;
    //   this.databaseService.addKitchenToken();
    // } else {
    //   // if the item exists in the kot, increase the quantity by 1 else add the item to the kot
    //   this.kots[kotIndex].products.find((item) => item.id === product.id)
    //     ? this.kots[kotIndex].products.find((item) => item.id === product.id)!
    //         .quantity++
    //     : this.kots[kotIndex].products.push(product);
    // }
    
    if (this.editKotMode!=null){
      // this.editKotMode.newKot.push(product);
      this.editKotMode.newKot.find((item) => item.id === product.id)
          ? this.editKotMode.newKot.find((item) => item.id === product.id)!
              .quantity++
          : this.editKotMode.newKot.push(product);
    } else {
      const kotIndex = this.kots.findIndex((kot) => kot.stage === 'active');
      if (kotIndex === -1) {
        let kot = new Kot(this.dataProvider.kotToken.toString(),product)
        this.kots.push(kot)
        this.dataProvider.kotToken++;
        this.databaseService.addKitchenToken();
      } else {
        // if the item exists in the kot, increase the quantity by 1 else add the item to the kot
        this.kots[kotIndex].products.find((item) => item.id === product.id)
          ? this.kots[kotIndex].products.find((item) => item.id === product.id)!
              .quantity++
          : this.kots[kotIndex].products.push(product);
      }
    }

    this.calculateBill();
  }

  editKot(kot: Kot) {
    if (this.currentKot?.stage === 'active') {
      if (
        confirm(
          'You are already editing a kot. Do you want to discard the changes and edit this kot?'
        )
      ) {
        this.editKotMode = {
          newKot: kot.products.slice(),
          previousKot: kot.products,
          kot: kot,
          kotIndex: this.kots.findIndex((localKot) => localKot.id==kot.id) || 0,
        };
        console.log('edit kot mode 1', this.editKotMode);
        this.dataProvider.manageKot = false;
        this.updated.next();
      } else {
        return;
      }
    } else {
      this.editKotMode = {
        newKot: kot.products.slice(),
        previousKot: kot.products,
        kot: kot,
        kotIndex: this.kots.findIndex((localKot) => localKot.id==kot.id) || 0,
      };
      console.log('edit kot mode', this.editKotMode);
      this.dataProvider.manageKot = false;
      this.updated.next();
    }
  }

  setAsNonChargeable(name: string, contact: string, reason: string) {
    this.billingMode = 'nonChargeable';
    this.nonChargeableDetail = {
      reason,
      time: Timestamp.now(),
      user: this.user,
      phone: contact,
      name,
    };
    this.calculateBill();
    this.updated.next();
  }

  setAsNormal() {
    this.billingMode = 'cash';
    this.nonChargeableDetail = undefined;
    this.calculateBill();
    this.updated.next();
  }

  calculateBill() {
    if (this.billingMode === 'nonChargeable') {
      this.billing.subTotal = 0;
      this.billing.grandTotal = 0;
      this.updated.next();
      return;
    }

    this.billing.subTotal = this.kots.reduce((acc, cur) => {
      return (
        acc +
        cur.products.reduce((acc, cur) => {
          return acc + cur.price * cur.quantity;
        }, 0)
      );
    }, 0);
    // calculate discounts
    let discounts:Discount[] = this.billing.discount.map((discount) => {
      if (discount.type === 'percentage'){
        return {
          ...discount,
          totalAppliedDiscount: (discount.value / 100) * this.billing.subTotal,
        };
      } else {
        return {
          ...discount,
          totalAppliedDiscount: discount.value,
        };
      }
    })
    this.billing.discount = discounts;
    // calculate taxes from taxes 
    taxes.map((tax) => {
      tax.amount = (tax.value / 100) * this.billing.subTotal;
    })
    let totalTax = taxes.reduce((acc, cur) => {
      return acc + (cur.value / 100) * this.billing.subTotal;
    }, 0);
    this.billing.taxes = taxes;
    this.billing.totalTax = totalTax;
    this.billing.grandTotal = this.billing.subTotal + totalTax;
    this.updated.next();
  }

  removeProduct(product: Product, kotIndex: number) {
    const index = this.kots[kotIndex].products.findIndex(
      (item) => item.id === product.id
    );
    this.kots[kotIndex].products.splice(index, 1);
    this.calculateBill();
  }

  finalizeAndPrintKot() {
    if (this.editKotMode != null) {
      console.log("Old kot", this.editKotMode.previousKot, "New kot", this.editKotMode.newKot);
      this.kots.find((kot) => this.editKotMode && kot.id === this.editKotMode.kot.id)!.products = this.editKotMode.newKot;
      // cancelled kot
      // this.printKot({...this.editKotMode.kot,products:this.editKotMode.previousKot} as Kot,true);
      // edited kot
      // this.printKot({...this.editKotMode.kot,products:this.editKotMode.newKot} as Kot);
    } else {
      let activeKot = this.kots.find(
        (value) => value.stage === 'active' || value.stage == 'edit'
      );
      if (activeKot) {
        activeKot.stage = 'finalized';
        console.log('Active kot', activeKot);
        this.databaseService.addKitchenToken();
        this.updated.next();
        if (this.kots.length > 1){
          if (this.nonChargeableDetail) {
            // running nonchargeable kot
            // this.printKot(activeKot); 
          } else {
            // running chargeable kot
            // this.printKot(activeKot);
          }
        } else {
          if (this.nonChargeableDetail) {
            // first nonchargeable kot
            // this.printKot(activeKot);
          } else {
            // first chargeable kot
            // this.printKot(activeKot);
          }
        }
      } else {
        alert('No active kot found');
      }
    }
  }

  addDiscount(discount: Discount) {
    this.billing.discount = [discount];
    this.billing.grandTotal = this.billing.subTotal;
    this.billing.discount.forEach((discount) => {
      if (discount.type === 'percentage') {
        this.billing.grandTotal -=
          (this.billing.subTotal * discount.value) / 100;
      } else {
        this.billing.grandTotal -= discount.value;
      }
    });
    this.updated.next();
  }

  addTax(tax: Tax) {
    this.billing.taxes.push(tax);
    this.billing.grandTotal = this.billing.subTotal;
    this.billing.taxes.forEach((tax) => {
      if (tax.type === 'percentage') {
        this.billing.grandTotal += (this.billing.subTotal * tax.value) / 100;
      } else {
        this.billing.grandTotal += tax.value;
      }
    });
    this.updated.next();
  }

  finalize() {
    // check if any kot is active
    if (this.kots.find((kot) => kot.stage === 'active')) {
      if (confirm('There are active KOTs. Do you want to finalize them?')) {
        this.finalizeAndPrintKot();
      }
    }
    this.stage = 'finalized';
    let data = this.toObject();
    this.databaseService.updateBill(data);
    this.updated.next();
    this.printBill()
  }
  setInstruction(){
    this.instruction = prompt('Enter instruction') || ''
    this.updated.next()
  }

  printBill(){
    let kotObjects:any[] = []
    this.kots.forEach((kot)=>{
      kotObjects.push(kot.toObject())
    })
    // merge all products of kots into one array and add quani
    let allProducts:any[] = []
    kotObjects.forEach((kot)=>{
      kot.products.forEach((product:any)=>{
        let index = allProducts.findIndex((res)=>res.id === product.id)
        if (index === -1){
          allProducts.push(product)
        } else {
          allProducts[index].quantity += product.quantity
        }
      })
    })
    let totalQuantity = allProducts.reduce((acc,cur)=>{
      return acc + cur.quantity
    },0)
    let settings:any =JSON.parse(localStorage.getItem('printerSettings') || '');
    if (!settings['port']){
      alert('Please set printer settings first')
      return
    }
    let discounts = this.billing.discount.map((res)=>{
      return {
        title:res.name,
        discountValue:res.value,
        discountType:res.type,
        appliedDiscountValue:res.totalAppliedDiscount,
      }
    })
    const data = {
      "printer":localStorage.getItem('billPrinter'),
      "currentProject":settings,
      "isNonChargeable":this.nonChargeableDetail?true:false,
      "complimentaryName":this.nonChargeableDetail?.name || '',
      "customerInfoForm":this.customerInfo,
      "kotsToken":this.kots.map((res)=>res.id).join(','),
      "currentTable":this.table.tableNo,
      "allProducts":allProducts,
      "selectDiscounts":discounts,
      "specialInstructions":this.instruction || false,
      "totalQuantity":totalQuantity,
      "tableNo":this.table.tableNo,
      "totalTaxAmount":this.billing.totalTax,
      "taxableValue":this.billing.subTotal,
      "date": (new Date()).toLocaleDateString('en-GB'),
      "time": (new Date()).toLocaleTimeString('en-GB'),
      "cgst":(this.billing.taxes[0].amount).toFixed(2),
      "sgst":(this.billing.taxes[1].amount).toFixed(2),
      "grandTotal":(this.billing.grandTotal).toFixed(2),
      "paymentMethod":this.billingMode,
      "id":this.id,
      "billNo":this.nonChargeableDetail ? "NC-" + this.id : this.id,
    }
    console.log("Data",data);
    fetch('http://192.168.29.125:'+settings['port']+'/printBill',{
        method:'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        console.log("Contente",res)
      }).catch((err) => {
        console.log("Error",err)
        alert("Error occurred while printing bill")
      })
  }

  printKot(kot:Kot,mode:"normal"|"running"|"cancelledMade"|"cancelledUnmade"|"modifiedUnmade"|"nonChargeable"|"nonChargeableRunning"){
    let products = kot.products.map((product)=>{
      return {
        name:product.name,
        quantity:product.quantity,
        instruction:product.instruction,
      }
    })
    let settings:any =JSON.parse(localStorage.getItem('printerSettings') || '');
    if (!settings['port']){
      alert('Please set printer settings first')
      return
    }
    const data = {
      "printer": localStorage.getItem('kotPrinter'),
      "currentProject":settings,
      "tokenNo": kot.id,
      // "deleted":deleted,
      // "mode":deleted ? "modified" : "normal",
      "tableNo":this.table.tableNo,
      "tableType":"table",
      "currentTable": this.table.tableNo,
      "allProducts":products,
      "billNo": this.id,
      "date":(new Date()).toLocaleString(),
    }
    console.log(data)
      fetch('http://192.168.29.125:'+settings['port']+'/printKot',{
        method:'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        console.log("Contente",res)
      }).catch((err) => {
        console.log("Error",err)
      })
  }

  settle(
    customerName: string,
    customerContact: string,
    paymentMethod: string,
    cardEnding?: string,
    upiAddress?: string
  ) {
    this.stage = 'settled';
    this.settlement = {
      customerName: customerName,
      customerContact: customerContact,
      paymentMethod: paymentMethod,
      cardEnding: cardEnding || '',
      upiAddress: upiAddress || '',
      time: Timestamp.now(),
      user: this.user,
    };
    this.dataProvider.currentBill = undefined;
    this.dataProvider.currentTable!.status = 'available';
    this.dataProvider.currentTable!.bill = null;
    this.dataProvider.currentTable = undefined;
    this.dataProvider.totalSales += this.billing.grandTotal;
    this.updated.next();
  }

  cancel(reason: string, phone: string) {
    this.stage = 'cancelled';
    this.cancelledReason = {
      reason: reason,
      phone: phone,
      time: Timestamp.now(),
      user: this.user,
    };
    // remove any active kot
    this.kots = this.kots.filter((kot) => kot.stage !== 'active');
    this.dataProvider.currentBill = undefined;
    this.dataProvider.currentTable!.status = 'available';
    this.dataProvider.currentTable!.bill = null;
    this.dataProvider.currentTable = undefined;
    // this.dataProvider.totalSales += this.billing.grandTotal;
    this.updated.next();
  }

  setCustomerInfo(customerInfo: CustomerInfo) {
    this.customerInfo = customerInfo;
    this.updated.next();
  }

  setTable(table: Table) {
    this.table = table;
    this.updated.next();
  }

  merge(bill: Bill) {
    bill.kots.forEach((kot) => {
      this.addKot(kot);
    });
    bill.clearAllKots();
    // clear the table
    bill.table.bill = null;
    bill.table.status = 'available';
    this.updated.next();
  }

  getKotsObject() {
    // return this.kots.map((kot) => {
    //   return kot.toObject();
    // });
  }

  toObject() {
    // return {
    //   'id': this.id,
    // }
    return {
      id: this.id,
      tokens: this.tokens,
      createdDate: this.createdDate,
      table: this.table.id,
      mode: this.mode,
      device: this.device,
      kots: this.kotWithoutFunctions,
      billing: this.billing,
      stage: this.stage,
      user: this.user,
      settlement: this.settlement || null,
      cancelledReason: this.cancelledReason || null,
      billingMode: this.billingMode,
      nonChargeableDetail: this.nonChargeableDetail || null,
      customerInfo: this.customerInfo,
    };
  }
}
